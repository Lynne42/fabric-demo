import LabelImage from "./labelImage";
import { circlePointConfig } from './cnavasConfig';


class PolygonLabelImage extends LabelImage {
  constructor(options) {
    super(options);

    this.Arrays.polygonErasePointIndex = 0;
    this.Arrays.polygonErasePointArray = [];
  }

  // 处理鼠标点下事件
  handleMouseDown = (options) => {
    try {
      if (this.Features.polygonOn) {
        this.handlePolygon(options);
        return;
      }

      if (this.Features.eraseOn) {
        this.handleErase(options);
        return;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // 点选 - 多边形
  handlePolygon = (options) => {
    const { polygonPointArray, polygonActiveShape } = this.Arrays.polygon;

    let isPolygonStartPointBool = false;
    if (polygonActiveShape) {
      isPolygonStartPointBool = this.isPolygonStartPoint(options);
    }

    if ((options.target && options.target.id === polygonPointArray[0]?.id) || isPolygonStartPointBool) {
      this.generatePolygon({
        type: "polygon",
        fill: 'rgba(255, 255, 255, 0.4)',
        stroke: 'none',
      });
    } else {
      this.addPolygonPoint({
        options,
        type: "polygon",
      });
    }
  };

  // 点选 - 反选
  handleErase = (options) => {
    const { polygonPointArray, polygonActiveShape } = this.Arrays.polygon;
    let isPolygonStartPointBool = false;
    if (polygonActiveShape) {
      isPolygonStartPointBool = this.isPolygonStartPoint(options);
    }
    if ((options.target && options.target.id === polygonPointArray[0]?.id) || isPolygonStartPointBool) {
      this.generatePolygon({
        type: "polygon-erase",
        config: {
          name: 'polygon-erase',
        },
      });
    } else {
      this.addPolygonPoint({
        options,
        type: "polygon-erase",
        configCircle: {
          fill: circlePointConfig.fillErase,
          firstFill: circlePointConfig.firstFillErase,
        },
      });
    }
  };

  // 双击合并图形
  handleMousedbDown = () => {
    try {
      if (this.Features.polygonOn) {
        this.generatePolygon({
          type: "polygon",
          fill: 'rgba(255, 255, 255, 0.4)',
          stroke: 'none',
        });
        return
      }

      if (this.Features.eraseOn) {
        this.generatePolygon({
          type: "polygon-erase",
          config: {
            name: 'polygon-erase',
          },
        });
        return
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  handleToDataURL = () => {
    this.createResultImage();
  };

  // 按比例预设区域
  presetAreaRect = (ratio) => {
    const { cHeight, cWidth, scale, canvas } = this;
    const w = cWidth * ratio;
    const h = cHeight * ratio;
    const x = cWidth / 2 - w / 2;
    const y = cHeight / 2 - h / 2;

    const points = [{
      x: x, y: y,
    }, {
      x: x + w, y: y,
    }, {
      x: x + w, y: y + h,
    }, {
      x: x, y: y + h,
    }, {
      x: x, y: y,
    }];

    // 矩形 用 多边形来画， 简化之后的图形与图形的相交判断
    const rect = this.drawImage.generatePolygon(points, {
      id: 'preset-rect'
    })
    canvas.add(rect)
    canvas.renderAll()
  }

  // 预设 objects
  setPreset(objs) {
    this.drawHoleToPolygon(objs.pythons, objs.pythonsHole)
  }

  clearAll = () => {
    this.clearObject();
  }

  getSavePresetObject = () => {
    return this.getPolygonAndHolePopygon();
  }


}

export default PolygonLabelImage;
