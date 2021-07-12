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
    const { polygonPointArray } = this.Arrays.polygon;
    if (options.target && options.target.id === polygonPointArray[0]?.id) {
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
    const { polygonPointArray } = this.Arrays.polygon;
    if (options.target && options.target.id === polygonPointArray[0]?.id) {
      this.generatePolygon({
        type: "polygon-erase",
        config: {
          fill: "green",
          renderOnAddRemove: true,
          globalCompositeOperation: "destination-out",
        },
      });
    } else {
      this.addPolygonPoint({
        options,
        type: "polygon-erase",
        configCircle: {
          fill: "rgba(255, 86, 86, 0.5)",
          firstFill: "rgba(255, 86, 218, 0.5)",
          stroke: "black",
        },
      });
    }
  };

  handleToDataURL = () => {
    this.createResultImage();
  };
}

export default PolygonLabelImage;
