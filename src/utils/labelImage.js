import DrawImage, {
  polygonConfig,
  circlePointConfig,
  lineConfig,
} from "./drawImage";

import CombineImage from './combineImage';

class LabelImage {
  constructor(options) {
    this.drawImage = new DrawImage();
    this.combineImage = new CombineImage();

    
    // 画布节点
    this.canvas = this.drawImage.createCanvas(
      options.canvas,
      options.canvasConfig
    );
    this.ctx = options.canvas;

    this.bgImg = null;

    this.cWidth = options.canvas.clientWidth;

    this.cHeight = options.canvas.clientHeight;

    this.iWidth = 0;
    // 图片高度
    this.iHeight = 0;
    // 图片拖拽至边缘最小显示
    this.appearSize = 180;
    // 缩放布进
    this.scaleStep = 0.02;
    // 最小缩放比例
    this.minScale = 0.2;
    // 最大缩放比例
    this.maxScale = 8;
    // 图片在画板中的横坐标
    this.x = 0;
    // 图片在画板中的纵坐标
    this.y = 0;
    // 鼠标当前画板中的横坐标
    this.mouseX = 0;
    // 鼠标当前画板中的纵坐标
    this.mouseY = 0;
    // 拖动过程中，鼠标前一次移动的横坐标
    this.prevX = 0;
    // 拖动过程中，鼠标前一次移动的纵坐标
    this.prevY = 0;
    // 缩放比例
    this.scale = 1;
    // 鼠标在图片中的横坐标
    this.ix = 0;
    // 鼠标在图片中的纵坐标
    this.iy = 0;

    // 绘制多边形的圆点半径
    this.radius = 6;

    // 绘制线段宽度
    this.lineWidth = 1;

    //绘制区域模块透明度
    this.opacity = 0.4;

    // 定时器
    this.timer = null;

    // 结果是否被修改
    this.isModify = false;

    // 是否移动图像标注圆点
    this.isDrogCircle = false;

    // 当前点击圆点index
    this.snapCircleIndex = 0;

    // 用于在拖拽或者缩放时，让绘制至存储面板的数据，只绘制一次
    this.drawFlag = true;

    // 监听滚动条缩放是否结束的定时器
    this.mousewheelTimer = null;

    // 历史记录下标
    this.historyIndex = 0;

    this.Arrays = {
      // 标定历史保存标签记录
      history: [],

      // 图片标注展示数据集
      imageAnnotateShower: [],

      // 图片标注存储数据集
      imageAnnotateMemory: [],

      // 生成标注图片结果
      resultLabelImage: null,

      // 标注集操作 result list index
      resultIndex: 0,

      // 多边形 标注点，线， 多边形集
      polygon: {
        polygonPointArray: [],
        polygonLineArray: [],
        polygonArray: [],
        polygonActiveLine: null,
        polygonActiveShape: null,
        polygonEdit: false,
      },
    };

    this.Features = {
      // 拖动开关
      dragOn: false,

      gridOn: false,

      // 多边形标注开关
      polygonOn: false,

      // 擦除开关
      eraseOn: false,

      // 十字线开关
      crossOn: false,

      // 标注结果显示
      labelOn: false,
    };

    // 事件监听
    this.handleEvent();
  }

  // 事件绑定
  handleEvent() {
    const that = this;
    const canvas = this.canvas;
    canvas.on("mouse:wheel", that.handleZoom.bind(that));
    // canvas.on("mouse:move", this.handleDrag);

    canvas.on("mouse:down", (options) => {
      that.handleMouseDown(options);
      // 合成组
      const { polygonOn, eraseOn } = that.Features;
      if (!polygonOn || !eraseOn) {
        // this.generateGroup();
      }
    });
  }

  // 缩放
  handleZoom(opt) {
    const delta = opt.e.deltaY;
    let zoom = (delta > 0 ? -0.1 : 0.1) + this.canvas.getZoom();
    zoom = Math.max(this.minScale, zoom);
    zoom = Math.min(this.maxScale, zoom);
    this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    this.scale = zoom;
    opt.e.preventDefault();
    opt.e.stopPropagation();
  }

  // 拖拽
  handleDrag(e) {
    // 拖拽
    if (this.Features.dragOn && e && e.e) {
      const { movementX, movementY } = e.e;

      const delta = new window.fabric.Point(movementX, movementY);

      this.canvas.relativePan(delta);
    }
  }

  // 设置 Features
  resetFeaturesAttr(key, value) {
    Object.keys(this.Features).forEach((item) => {
      this.Features[item] = false;
    });
    this.Features[key] = value;
  }

  // 绘制多边形 点 线
  addPolygonPoint({ options, type = "polygon", configCircle = {} }) {
    const { canvas, Arrays } = this;
    let { polygonPointArray, polygonLineArray, polygonActiveShape } =
      Arrays.polygon;

    const arr = polygonPointArray || [];

    const currentPoint = this.getCurrentPointInfo(options);

    const currentPointZoom = {
      name: `${type}-point-${arr.length}`,
      ...currentPoint,
    };

    const circle = this.drawImage.generateCircle(
      currentPointZoom,
      configCircle
    );
    if (arr.length === 0) {
      circle.set({
        fill: configCircle.firstFill || circlePointConfig.firstFill,
      });
    }

    const points = [
      currentPointZoom.x,
      currentPointZoom.y,
      currentPointZoom.x,
      currentPointZoom.y,
    ];

    const line = this.drawImage.generateLine(points);

    if (polygonActiveShape) {
      const points = polygonActiveShape.get("points");

      points.push(currentPointZoom);
      const polygon = this.drawImage.generatePolygon(points);

      canvas.remove(polygonActiveShape);
      canvas.add(polygon);
      Arrays.polygon.polygonActiveShape = polygon;
    } else {
      const polygon = this.drawImage.generatePolygon([currentPointZoom]);
      Arrays.polygon.polygonActiveShape = polygon;
      canvas.add(polygon);
    }

    Arrays.polygon.polygonActiveLine = line;
    polygonPointArray.push(circle);
    polygonLineArray.push(line);

    canvas.add(line);
    canvas.add(circle);
    canvas.selection = false;
  }

  // 绘制完整的多边形
  generatePolygon({ type, config = {} }) {
    const originObject = this.canvas.getObjects();
    const { canvas, Arrays } = this;
    let {
      polygonPointArray,
      polygonLineArray,
      polygonActiveLine,
      polygonActiveShape,
      polygonArray,
    } = Arrays.polygon;

    const points = [];
    polygonPointArray.forEach((point) => {
      points.push({
        x: point.left,
        y: point.top,
      });
      canvas.remove(point);
    });

    polygonLineArray.forEach((line) => {
      canvas.remove(line);
    });

    canvas.remove(polygonActiveShape).remove(polygonActiveLine);
    const polygon = this.drawImage.generatePolygon(points, config);

    if (type === "polygon") {
      polygonArray.push(polygon);
      // this.drawImage.editPolygon(polygon);

      if(polygonArray.length > 1) {
        
        const newPoint = this.combineImage.union(canvas.getObjects()[0].get('points'), points);
        console.log(89888, newPoint)
        this.clearObject();
        
        newPoint.forEach(np => {
          this.canvas.add(this.drawImage.generatePolygon(np, config))
        })
        canvas.renderAll();
      } else {
        this.canvas.add(polygon);
      }

    } else if (type === "polygon-erase") {
      polygonArray.forEach((item) => {
        canvas.remove(item);
      });
      // this.drawImage.editPolygon(polygon);
      const groupClip = this.drawImage.generateGroup(
        [...originObject, polygon],
        {
          selectable: false,
          hasControls: false,
          evented: false,
          clipPath: polygon,
        }
      );

      this.canvas.add(groupClip);
    }

    // canvas.add(groupClip);
    
    this.resetFeaturesAttr("polygonOn", false);
    this.resetPolygonData();
    console.log(2111, this.canvas.getObjects());
  }

  createCombinePolygon() {
    
  }

  clearObject() {
    const objs = this.canvas.getObjects();
    objs.forEach(item => {
      this.canvas.remove(item)
    })
  }

  generateGroup() {
    const objs = this.canvas.getObjects();
    const group = this.drawImage.generateGroup([...objs], {
      selectable: true,
      hasBorders: true,
      hasControls: true,
      evented: false,
    });
    this.canvas.add(group);
    objs.forEach((item) => this.canvas.remove(item));
  }

  // 判断当前点击的点是不是多边形的起点
  isPolygonStartPoint(options) {
    const { polygonActiveShape } = this.Arrays.polygon;
    const startPoint = polygonActiveShape.get("points")[0];
    const currentPoint = this.getCurrentPointInfo(options);
    const radius = Math.floor(circlePointConfig.radius / 2);
    if (
      Math.abs(startPoint.x - currentPoint.x) <= radius &&
      Math.abs(startPoint.y - currentPoint.y) <= radius
    ) {
      return true;
    }
    return false;
  }

  // 获取当前点击点的位置
  getCurrentPointInfo(options) {
    return {
      x: this.canvas.getPointer(options.e).x,
      y: this.canvas.getPointer(options.e).y,
    };
  }

  // reset Arrays.polygon
  resetPolygonData() {
    const polygon = this.Arrays.polygon;
    polygon.polygonActiveLine = null;
    polygon.polygonActiveShape = null;
    polygon.polygonPointArray = [];
    polygon.polygonLineArray = [];
  }

  // 设置背景图片
  setImage(imgsrc) {
    const that = this;
    window.fabric.Image.fromURL(
      imgsrc,
      function (img) {
        img.set({
          scaleX: that.canvas.width / img.width,
          scaleY: that.canvas.height / img.height,
          left: 0,
          top: 0,
          originX: "left",
          originY: "top",
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          name: "bg-img",
        });
        that.bgImg = img;
        that.iWidth = img.width;
        // 图片高度
        that.iHeight = img.height;
        that.canvas.setBackgroundImage(
          img,
          that.canvas.renderAll.bind(that.canvas)
        );
      },
      { crossOrigin: "anonymous" }
    );
  }

  createResultImage() {
    const result = this.canvas.toDataURL({
      format: "jpeg", // jpeg或png
      quality: 0.8, // 图片质量，仅jpeg时可用
      // 截取指定位置和大小
      left: 0,
      top: 0,
      width: 320,
      height: 320,
    });
    this.Arrays.resultLabelImage = result;
  }

  // 获取指定name的object
  getObjectsByName(name = "") {
    return this.canvas.getObjects().filter((item) => item.name === name);
  }

  // 边界检测
  checkBoudningBox(e) {
    const obj = e.target;
    if (!obj) {
      return;
    }
    obj.setCoords();

    const objBoundingBox = obj.getBoundingRect();

    console.log("边界", objBoundingBox);

    if (objBoundingBox.top < 0) {
      obj.set("top", objBoundingBox.height / 2);
      obj.setCoords();
    }
    if (objBoundingBox.left > this.canvas.width - objBoundingBox.width) {
      obj.set("left", this.canvas.width - objBoundingBox.width / 2);
      obj.setCoords();
    }
    if (objBoundingBox.top > this.canvas.height - objBoundingBox.height) {
      obj.set("top", this.canvas.height - objBoundingBox.height / 2);
      obj.setCoords();
    }
    if (objBoundingBox.left < 0) {
      obj.set("left", objBoundingBox.width / 2);
      obj.setCoords();
    }
  }
}

export default LabelImage;
