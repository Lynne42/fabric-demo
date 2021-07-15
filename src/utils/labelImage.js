import DrawImage, {
  polygonConfig,
  circlePointConfig,
  lineConfig,
  INTERSECT,
  CONTAIN,
} from "./drawImage";

import CombineImage from "./combineImage";

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
    this.minScale = 1;
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
        polygonMark: {},
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
    let { polygonPointArray, polygonLineArray, polygonActiveShape } = Arrays.polygon;

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
    const { canvas, Arrays } = this;
    let {
      polygonPointArray,
      polygonLineArray,
      polygonActiveLine,
      polygonActiveShape,
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
      // this.drawImage.editPolygon(polygon);

      this.createCombinePolygon(polygon, config);

    } else if (type === "polygon-erase") {

      this.createErasePolygon(polygon, config)
    }

    // this.resetFeaturesAttr("polygonOn", false);
    this.resetPolygonData();
    console.log(2111, this.canvas.getObjects());
  }

  // handle area select combine
  createCombinePolygon(newPolygon, config) {

    const { canvas, Arrays } = this;
    let { polygonPointArray, polygonLineArray, polygonMark } = Arrays.polygon;

    console.log('init', this.Features)
    let nowPoly =  newPolygon;
    const preObjects = this.getObjects();

    if(!preObjects.length) {
      canvas.add(nowPoly);
      polygonMark['polygon-0'] = nowPoly;
      return
    }

    console.log(11, polygonMark)


    // 获取画布上 洞 与 图形的各个集合
    const { pythons, pythonsHole, } = this.transformObjectToGroupByType();

    if(pythonsHole.length) {
      /*
      如果当前画布上有洞
        - 获取画布上的洞 与 新图形的 包含关系
          如果有包含关系，则返回 合并后的 图形列表
      */

      const { intersectionArr: containArr, noIntersectionArr: nocontainArr } = this.drawImage.getContainResultCombine(pythonsHole, nowPoly, CONTAIN);
      if(containArr) {

      }

    } else {

      polygonMark = {};
      // 当前画布上没有洞， 直接与画布上的图形做并集

      // 获取当前画布上的图形 与新图形有无 交集的情况 （ 并集即使是包含关系也能正确判断）
      const { intersectionArr, noIntersectionArr } = this.drawImage.getIntersectsOrContainResult(pythons, nowPoly, INTERSECT);
      console.log(3433, intersectionArr, noIntersectionArr)
      if(intersectionArr.length) {
        // 如果判断有交集， 则进行合并， 将合并后的图形继续与下一个图形进行 并集
        nowPoly = this.combineImage.multiUnion(intersectionArr, nowPoly, (polyPoint) => (
          this.drawImage.generatePolygon(polyPoint[0], config)
        ))
      }
      noIntersectionArr.push(nowPoly)
      noIntersectionArr.forEach((item, index) => {
        polygonMark[`polygon-${index}`] = item;
      });
      this.updatePolygon(noIntersectionArr);

    }

    console.log('polygonMark', polygonMark)
  }


  // handle area erase combine
  createErasePolygon(newPolygon, config) {
    let nowPoly =  newPolygon;
    const { canvas, Arrays } = this;
    let { polygonPointArray, polygonLineArray, polygonMark } = Arrays.polygon;
    polygonMark = {};

    const preObjects = this.getObjects();

    // 获取画布上 洞 与 图形的各个集合
    const { pythons, pythonsHole, } = this.transformObjectToGroupByType();


    /**
     * 判断要删除的多边形
     * - 是否与原多边形 和 孔 有包含关系
     *    - 如果有包含关系的话， 直接设置2D效果
     *    - 如果没有包含关系
     *      - 判断与原多边形是否有交集
     *        - 如果有交集，则直接剪切
     *
     *        - 如果没有交集， 则废弃该多边形
     */
    // First determine whether to include the relationship

    if(pythonsHole.length) {
      const { polygon, polygonHole } = this.drawImage.getContainResult(pythons, nowPoly);
      const result = this.getEraseResultPolygon(polygon, [...pythonsHole, ...polygonHole, ], config);
      console.log(5555, pythons, pythonsHole, polygon, polygonHole, result)
      this.clearObject();
      result.forEach(item => {
        canvas.add(item)
      })

    } else {
      const { intersectionArr: containArr, noIntersectionArr: nocontainArr } = this.drawImage.getIntersectsOrContainResult(pythons, nowPoly, CONTAIN);

      if(containArr.length) {
        this.clearObject();
        nocontainArr.forEach(item => {
          canvas.add(item)
        })
        containArr.forEach((item, index) => {
          item.flag = 'polygon-parent-hole-' + index;
          canvas.add(item)
        })
        canvas.add(this.drawImage.generatePolygon(nowPoly.get('points'), {
          ...config,
          fill: 'rgba(255, 255, 255, 0.5)',
          globalCompositeOperation: 'destination-out',
          flag: 'polygon-erase-hole'
        }))
        canvas.renderAll();

      } else {
        // Determine the intersecting relationship
        const { intersectionArr, noIntersectionArr } = this.drawImage.getIntersectsOrContainResult(preObjects, nowPoly, INTERSECT);
        if(intersectionArr.length) {

          const resultPoints = this.combineImage.multiDifference(intersectionArr, nowPoly);

          resultPoints.forEach(item => {
            noIntersectionArr.push(this.drawImage.generatePolygon(item, config))
          })
        }

        noIntersectionArr.forEach((item, index) => {
          polygonMark[`polygon-${index}`] = item;
        });
        this.updatePolygon(noIntersectionArr);
      }
    }


    console.log('polygonMark', polygonMark)
    // isContainedWithinObject


  }

  // handle polygon and polygon hole
  getEraseResultPolygon(polygons, polygonsHole, config) {
    const { isContainedWithinObject, isIntersectsWithObject } = this.drawImage;
    let arr = [];

    for(let i = 0, len = polygons.length; i < len; i++) {
      for(let j = 0, len1 = polygonsHole.length; j < len1; j++) {
        if(isContainedWithinObject(polygons[i], polygonsHole[j])) {
          arr.push(polygons[i]);
          arr.push(polygonsHole[j]);
          continue
        } else if(isIntersectsWithObject(polygons[i], polygonsHole[j])) {
          const resultPoints = this.combineImage.difference(polygons[i], polygonsHole[j]);
          arr.push(this.drawImage.generatePolygon(resultPoints, config))
        } else {
          arr.push(polygons[i]);
        }
      }
    }
    return arr
  }

  // determine python or python hole
  transformObjectToGroupByType() {
    const objs = this.getObjects();
    let pythons = [];
    let pythonsHole = [];
    objs.forEach(item => {
      if(item.flag && item.flag.startsWith('polygon-erase')) {
        pythonsHole.push(item);
      } else {
        pythons.push(item);
      }
    })
    return {
      pythons,
      pythonsHole,
    }
  }

  updatePolygon(polysArr=[]) {
    this.clearObject();

    polysArr.forEach((np) => {
      if(np) {
        this.canvas.add(np);
      }
    });
    this.canvas.renderAll();
  }

  clearObject() {
    const objs = this.getObjects();

    objs.forEach((item) => {
      this.canvas.remove(item);
    });
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

  // get all graphics objects on the current canvas
  getObjects() {
    return this.canvas.getObjects()
  }

  // Determine whether the current point is in a circle
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

  // get current point info
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

  // set background image
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

  // create result base64 image
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
