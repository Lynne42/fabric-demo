import LabelImage from "./labelImage";

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
      this.generatePolygon("polygon");
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
          globalCompositeOperation: 'destination-out',
        },
      });

      // this.canvas.setImage("https://i.ibb.co/cXKy30V/Rectangle-139.png");
      this.canvas.renderAll();
      console.log(this.canvas.getObjects());

    } else {
      this.addPolygonPoint({
        options,
        type: "polygon-erase",
        configCircle: {
          fill: "rgba(255, 86, 86, 0.5)",
          firstFill: "rgba(255, 86, 218, 0.5)",
        },
      });
    }
  };
}

export default PolygonLabelImage;
