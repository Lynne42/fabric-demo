import LabelImage from "./labelImage";

const fabric = window.fabric;

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
          fill: "rgba(255, 86, 86, 0.3)",
          firstFill: "rgba(255, 86, 218, 0.5)",
        },
      });
    }
  };

  handleToDataURL = () => {
    this.createResultImage();
  };
}

export default PolygonLabelImage;
