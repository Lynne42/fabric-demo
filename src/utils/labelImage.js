import DrawImage, { PolygonHole } from "./drawImage";

import { polygonConfig, circlePointConfig } from './cnavasConfig';

import CombineImage from "./combineImage";

class LabelImage {
  constructor(options) {
    this.drawImage = new DrawImage();
    this.combineImage = new CombineImage();

    this.PolygonHole = PolygonHole;

    // 画布节点
    this.canvas = this.drawImage.createCanvas(
      options.canvas,
      options.canvasConfig
    );
    this.ctx = options.canvas;

    this.bgImg = null;

    // canvas width
    this.cWidth = this.canvas.getWidth();

    // canvas height
    this.cHeight = this.canvas.getHeight();

    this.iWidth = 0;
    // 图片高度
    this.iHeight = 0;
    // 缩放步长
    this.zoomSpace = 0.1;
    // 最小缩放比例
    this.minScale = 1;
    // 最大缩放比例
    this.maxScale = 8;

    // 鼠标当前画板中的横坐标
    this.mouseX = 0;
    // 鼠标当前画板中的纵坐标
    this.mouseY = 0;

    // drag 前 group rect 坐标
    this.originX = 0;
    this.originY = 0;

    // drag 后 group rect 与 drag 前 group rect 坐标 的偏移量
    this.offsetOriginX = 0;
    this.offsetOriginY = 0;

    // drag 累计 偏移差
    this.relativeMouseX = 0;
    this.relativeMouseY = 0;

    // 拖动过程中，鼠标前一次移动的横坐标
    this.prevX = 0;
    // 拖动过程中，鼠标前一次移动的纵坐标
    this.prevY = 0;
    // 缩放比例
    this.scale = 1;

    this.Arrays = {
      // 生成标注图片结果
      resultLabelImage: null,

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

      // 鼠标滚动标记
      mouseWheelOn: false,

      // 鼠标按下开关
      mouseDownMoveOn: false,

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
    const Features = this.Features;
    let mouseDownTimer = null;
    let mouseWheelTimer = null;

    canvas.on("mouse:wheel", (e) => {
      Features.mouseWheelOn = true;
      if (Features.mouseWheelOn) {
        that.handleZoom(e);
        that.forbidCircleAndlinescaling();
      }
      clearTimeout(mouseWheelTimer);
      mouseWheelTimer = setTimeout(() => {
        Features.mouseWheelOn = false;
        this.clearWhiteBorder();
      }, 100);
    });
    canvas.on("mouse:dblclick", e => {
      console.log(999)
      that.handleMousedbDown(e);
    })
    canvas.on("mouse:down", (e) => {
      if (e.e.altKey) {
        Features.mouseDownMoveOn = true;
      } else {
        mouseDownTimer = setTimeout(() => {
          Features.mouseDownMoveOn = true;
        }, 200);
      }
    });

    canvas.on("mouse:up", (e) => {
      clearTimeout(mouseDownTimer);
      if (Features.mouseDownMoveOn) {
        Features.mouseDownMoveOn = false;
        this.clearWhiteBorder();
      } else {
        that.handleMouseDown(e);
      }
    });

    canvas.on("mouse:move", (e) => {
      that.handleDrag(e);
    });

    canvas.on("object:moving", (e) => {
      Features.mouseDownMoveOn = false;
      //this.checkBoudningBox(e)
    });
    canvas.on("object:moved", (e) => {
      Features.mouseDownMoveOn = true;
    });

  }

  // canvas 缩放
  handleZoom(opt) {
    opt.e.preventDefault();
    opt.e.stopPropagation();

    const delta = opt.e.deltaY;
    let zoom =
      (delta > 0 ? -this.zoomSpace : this.zoomSpace) + this.canvas.getZoom();
    zoom = Math.max(this.minScale, zoom);
    zoom = Math.min(this.maxScale, zoom);
    this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    this.scale = zoom;
    this.canvas.renderAll();
  }

  // canvas 拖拽
  handleDrag(e) {
    const that = this;
    if (that.Features.mouseDownMoveOn && e && e.e) {
      let delta = that.drawImage.generatePoint(e.e.movementX, e.e.movementY);
      that.canvas.relativePan(delta);
      that.relativeMouseX += e.e.movementX / that.scale;
      that.relativeMouseY += e.e.movementY / that.scale;
    }
  }

  // 缩放和拖拽完成后处理白边
  clearWhiteBorder() {
    const { tl, tr, bl, br } = this.canvas.vptCoords;
    const { isBorder, isLeft, isTop, isRight, isBottom } = this.isWhiteBorder(
      tl,
      br
    );
    if (isBorder) {
      const transform = this.canvas.viewportTransform;
      const fixedX = -this.cWidth * this.scale + this.cWidth;
      const fixedY = -this.cHeight * this.scale + this.cHeight;
      let translateX = 0; // isLT ? 0 : ;
      let translateY = 0;


      if (isLeft && isTop) {
        translateX = 0;
        translateY = 0;
      } else if (isBottom && isRight) {
        translateX = fixedX;
        translateY = fixedY;

      } else if (isLeft && isBottom) {
        translateX = 0;
        translateY = fixedY;
      } else if (isTop && isRight) {
        translateX = fixedX;
        translateY = 0;
      } else if (isTop) {
        translateX = transform[4];
        translateY = 0;

      } else if (isLeft) {
        translateX = 0;
        translateY = transform[5];

      } else if (isBottom) {
        translateX = transform[4];
        translateY = fixedY;
      } else if (isRight) {
        translateX = fixedX;
        translateY = transform[5];
      }

      this.canvas.setViewportTransform([
        this.scale,
        0,
        0,
        this.scale,
        translateX,
        translateY,
      ]);
      this.canvas.renderAll();

    }
  }

  // 判断是否出现白边
  isWhiteBorder(tl, br) {
    let isLeft = tl.x < 0,
      isTop = tl.y < 0,
      isRight = br.x > this.cWidth,
      isBottom = br.y > this.cHeight;
    let isBorder = isLeft || isTop || isRight || isBottom;
    return {
      isBorder,
      isLeft,
      isTop,
      isRight,
      isBottom,
    };
  }

  // 设置 drag前 前 group rect 坐标
  setOriginGroupInfo(groupObject) {
    const { left, top } = groupObject.getBoundingRect();
    this.originX = left;
    this.originY = top;
  }

  // 设置 drag 后 group rect 与 drag 前 group rect 坐标 的偏移量
  setOriginGroupOffsetInfo(groupObject) {
    const { left, top } = groupObject.getBoundingRect();
    this.offsetOriginX = left - this.originX;
    this.offsetOriginY = top - this.originY;
  }

  // 避免circle and line scale
  forbidCircleAndlinescaling() {
    const circleAndLineList = this.getObjects().filter(
      item => item.class === 'circle' || item.class === 'polygon'
    )
    circleAndLineList.forEach(item => {
      if(item.class === 'circle') {
        item.set('scaleX', 1 / this.scale )
        item.set('scaleY', 1 / this.scale )
      } else {
        item.set('strokeWidth', 2 / this.scale )
      }
    })

    this.canvas.renderAll();
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
      {
        ...configCircle,
        scaleX: 1 / this.scale,
        scaleY: 1 / this.scale,
      }
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
      const polygon = this.drawImage.generatePolygon(points, {
        stroke: polygonConfig.fill,
        fill: polygonConfig.fillOpcity,
        strokeWidth: 2/this.scale,
      });

      canvas.remove(polygonActiveShape);
      canvas.add(polygon);
      Arrays.polygon.polygonActiveShape = polygon;
    } else {
      const polygon = this.drawImage.generatePolygon([currentPointZoom], {
        stroke: polygonConfig.fill,
        fill: polygonConfig.fillOpcity,
        strokeWidth: 2/this.scale,
      });
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
      this.createCombinePolygon(polygon, config);
    } else if (type === "polygon-erase") {
      this.createErasePolygon(polygon, config);
    }

    // this.resetFeaturesAttr("polygonOn", false);
    this.resetPolygonData();
  }

  // handle area select combine
  createCombinePolygon(nowPoly, config) {
    const { drawImage, combineImage, canvas } = this;

    // 获取画布上 洞 与 图形的各个集合
    const { pythons, pythonsHole } = this.getPolygonAndHolePopygon();

    canvas.add(nowPoly);

    const newPythonsHole = pythonsHole
      .map((item) => {
        if (drawImage.isContainedWithinObject(nowPoly, item)) {
          return null;
        }
        return item;
      })
      .filter((item) => !!item);

    const { relationshipList, noRelationshipList } =
      drawImage.getIntersectionByPreAndTarget(pythons, nowPoly);

    if (!relationshipList.length) {
      this.drawHoleToPolygon([...pythons, nowPoly], [...pythonsHole]);
      // this.updatePolygon([...pythons, nowPoly, ...pythonsHole]);
    } else {
      const {
        relationshipList: holeRelationshipList,
        noRelationshipList: noHoleRelationshipList,
      } = drawImage.getIntersectionByPreAndTarget(newPythonsHole, nowPoly);

      if (!holeRelationshipList.length) {
        const targePolygon = this.combineImage.multiUnion(
          relationshipList,
          nowPoly,
          (point) => this.drawImage.generatePolygon(point, config)
        );
        canvas.add(targePolygon);
        // this.updatePolygon([...noRelationshipList, targePolygon, ...noHoleRelationshipList]);
        this.drawHoleToPolygon(
          [...noRelationshipList, targePolygon],
          [...noHoleRelationshipList]
        );
      } else {
        const points = combineImage.multiDifference(
          holeRelationshipList,
          nowPoly
        );
        const newPolygon = points.map((item) =>
          this.drawImage.generatePolygon(item, config)
        );

        const targePolygon = this.combineImage.multiUnion(
          relationshipList,
          nowPoly,
          (point) => this.drawImage.generatePolygon(point)
        );

        newPolygon.forEach((item) => canvas.add(item));

        canvas.add(targePolygon);
        // this.updatePolygon([...noRelationshipList, targePolygon, ...noHoleRelationshipList, ...newPolygon]);

        this.drawHoleToPolygon(
          [...noRelationshipList, targePolygon],
          [...noHoleRelationshipList, ...newPolygon]
        );
      }
    }
  }

  // handle area erase combine
  createErasePolygon(nowPoly, config) {
    const { drawImage } = this;

    // 获取画布上 洞 与 图形的各个集合
    const { pythons, pythonsHole } = this.getPolygonAndHolePopygon();

    const { relationshipList, noRelationshipList } =
      drawImage.getIntersectionByPreAndTarget(pythons, nowPoly);

    if (!relationshipList.length) {
      this.drawHoleToPolygon(pythons, pythonsHole);
    } else {
      // 与old hole 并集
      const {
        relationshipList: holeRelationshipList,
        noRelationshipList: noHoleRelationshipList,
      } = drawImage.getIntersectionByPreAndTarget(pythonsHole, nowPoly);

      let targetHole = nowPoly;

      if (holeRelationshipList.length) {
        // 与 hole 并集
        targetHole = this.combineImage.multiUnion(
          holeRelationshipList,
          nowPoly,
          (point) => this.drawImage.generatePolygon(point, config)
        );
        // canvas.add(targetHole)
      }

      const { containerList, noContainerList } =
        drawImage.getContainerByPreOrTarget(relationshipList, targetHole);

      console.log("erase2", containerList, noContainerList);

      if (containerList.length) {
        this.drawHoleToPolygon(
          [...containerList, ...noContainerList, ...noRelationshipList],
          [...noHoleRelationshipList, targetHole]
        );
      } else {
        const resultPoint = this.combineImage.multiDifference(
          relationshipList,
          targetHole
        );
        const newPolygon = resultPoint.map((item) =>
          this.drawImage.generatePolygon(item, config)
        );

        this.drawHoleToPolygon(
          [...noRelationshipList, ...newPolygon],
          [...noHoleRelationshipList]
        );
      }
    }
  }

  // 获取 polygon and hole
  getPolygonAndHolePopygon() {
    const objs = this.getObjects();

    console.log("getPolygon", objs);
    let pythons = [];
    let pythonsHole = [];

    objs.forEach((item) => {
      pythons.push(item);
      if (item.holes) {
        item.holes.forEach((hole) => {
          pythonsHole.push(this.drawImage.generatePolygon(hole));
        });
      }
    });
    return {
      pythons,
      pythonsHole,
    };
  }

  // 生成 polygon abd hole
  drawHoleToPolygon(polygons, holes) {
    const resultPoint = [];
    for (let i = 0, len = polygons.length; i < len; i++) {
      resultPoint[i] = [];
      resultPoint[i].push(polygons[i].points);

      for (let j = 0, len2 = holes.length; j < len2; j++) {
        if (this.drawImage.isContainedWithinObject(polygons[i], holes[j])) {
          resultPoint[i].push(holes[j].points);
        }
      }
    }

    let canvasObject = [];
    resultPoint.forEach((item) => {
      if (item.length > 1) {
        const pro = new this.PolygonHole(item, {
          ...polygonConfig,
          fill: polygonConfig.resultFill,
          stroke: polygonConfig.resultStroke,
        });
        canvasObject.push(pro);
      } else {
        canvasObject.push(
          this.drawImage.generatePolygon(item[0], {
            ...polygonConfig,
            fill: polygonConfig.resultFill,
            stroke: polygonConfig.resultStroke,
          })
        );
      }
    });

    this.updatePolygon(canvasObject);
  }

  // 更新canvas
  updatePolygon(polysArr = []) {
    this.clearObject();
    polysArr.forEach((np) => {
      if (np) {
        this.canvas.add(np);
      }
    });
    this.canvas.renderAll();
  }

  // 清除为合成的polygon
  clearNoPolygon() {
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

    this.resetPolygonData();
  }

  // 清空canvas
  clearObject() {
    const objs = this.getObjects();

    objs.forEach((item) => {
      this.canvas.remove(item);
    });
    this.Arrays.polygon.polygonPointArray = [];
    this.Arrays.polygon.polygonLineArray = [];
    this.Arrays.polygon.polygonActiveShape = null;
    this.canvas.renderAll()
  }

  // 组合 所有画布对象 为一组
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
  getObjects(type = "") {
    if (!type) {
      return this.canvas.getObjects();
    } else {
      return this.canvas
        .getObjects()
        .map((item) => {
          if (item.name === type || item.id === type) {
            return item;
          }
          return null;
        })
        .filter((item) => !!item);
    }
  }

  // Determine whether the current point is in a circle
  isPolygonStartPoint(options) {
    const { polygonActiveShape } = this.Arrays.polygon;
    const startPoint = polygonActiveShape.get("points")[0];
    const currentPoint = this.getCurrentPointInfo(options);
    const radius = Math.floor(circlePointConfig.radius);
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

  // 合并组
  toGroup() {
    const objs = this.getObjects();

    const group = this.drawImage.generateGroup(objs, {
      id: "group",
    });

    this.updatePolygon([group]);

    this.canvas.setActiveObject(group);

    this.setOriginGroupInfo(group);
  }

  // 分离组
  splitGroup() {
    const that = this;
    const objs = that.getObjects("group");

    if (objs && objs.length) {
      // 始终合成一个组， 所以不用循环
      const group = objs[0];

      // 设置 当前组与 未移动前的 组的偏移量
      that.setOriginGroupOffsetInfo(group);

      const subObjects = group.getObjects();
      group.destroy();
      that.canvas.remove(group);

      console.log("组", subObjects);
      const resultPolygon = [];
      // 根据偏移量， 重写 polygon的 点
      subObjects.forEach((object) => {
        const pts = object.get("points");
        if(pts && pts.length) {
          const nowPoint = that.resetPoints(
            object.get("points"),
            that.offsetOriginX,
            that.offsetOriginY
          );

          if (object.holes && object.holes.length) {
            const holePointArr = object.holes.map((hole) =>
              that.resetPoints(hole, that.offsetOriginX, that.offsetOriginY)
            );
            const pro = new that.PolygonHole(
              [nowPoint, ...holePointArr],
              polygonConfig
            );
            resultPolygon.push(pro);
          } else {
            resultPolygon.push(
              that.drawImage.generatePolygon(nowPoint, polygonConfig)
            );
          }
        }

      });
      if(resultPolygon && resultPolygon.length) {
        that.updatePolygon(resultPolygon);
      }

    }
  }

  resetPoints(pointsArr, x, y) {
    const nowPoint = pointsArr.map((itemPoint) => ({
      x: itemPoint.x + x,
      y: itemPoint.y + y,
    }));
    return nowPoint;
  }

  // download create result base64 image
  createResultImage() {
    const that = this;
    const dom = document.createElement("canvas");
    const nowCanvas = that.drawImage.createStaticCanvas(dom, {
      width: that.cWidth,
      height: that.cHeight,
      backgroundColor: "#fff",
    });

    const objects = that.canvas.getObjects();
    if(!objects.length) {
      return {
        region: null
      }
    }
    objects.forEach((nowItem) => {
      nowItem.set('fill', 'block');
      nowCanvas.add(nowItem);
    });
    const result = nowCanvas.toDataURL({
      format: "png",
      left: 0,
      top: 0,
      width: that.cWidth,
      height: that.cHeight,
    });
    // that.Arrays.resultLabelImage = result;

    console.log(99, result)
    nowCanvas.clear();
    objects.forEach((nowItem) => {
      nowItem.set('fill', polygonConfig.resultFill);
    });
    this.updatePolygon(objects)


    return {
      region: result
    }
  }

  // drag by btn
  moveDragByKeyboard = (type, value) => {
    const { canvas, cHeight, cWidth } = this;
    const activeObj = canvas.getObjects()[0];
    if (!activeObj) {
      return;
    }
    // activeObj.setCoords()
    const { left, top, width: scaleWidth, height: scaleHeight } = activeObj.getBoundingRect();
    const width = Math.round(scaleWidth / this.scale);
    const height = Math.round(scaleHeight / this.scale);

    const space = parseInt(value) || 0;


    switch (type) {
      case "top":
        activeObj.top = activeObj.top - space;
        activeObj.setCoords();
        break;
      case "right":
        activeObj.set(
          "left",
          activeObj.left + space
        );
        activeObj.setCoords();
        break;
      case "bottom":
        activeObj.top = activeObj.top + space;
        activeObj.setCoords();
        break;
      case "left":
        activeObj.set("left", activeObj.left - space);
        activeObj.setCoords();

        break;
      default:
        break;
    }
    this.canvas.renderAll();
  };

  // 检查边界，避免元素拖出边界
  checkBoudningBox(e) {
    // const obj = e.target;
    // if (!obj) {
    //   return;
    // }
    // obj.setCoords();

    // const objBoundingBox = obj.getBoundingRect(false);

    // if (objBoundingBox.top < 0) {
    //   obj.set("top", objBoundingBox.height / 2);
    //   obj.setCoords();
    // }
    // if (objBoundingBox.left > this.canvas.width - objBoundingBox.width) {
    //   obj.set("left", this.canvas.width - objBoundingBox.width / 2);
    //   obj.setCoords();
    // }
    // if (objBoundingBox.top > this.canvas.height - objBoundingBox.height) {
    //   obj.set("top", this.canvas.height - objBoundingBox.height / 2);
    //   obj.setCoords();
    // }
    // if (objBoundingBox.left < 0) {
    //   obj.set("left", objBoundingBox.width / 2);
    //   obj.setCoords();
    // }
  }

}

export default LabelImage;
