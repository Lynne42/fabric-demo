import LabelImage from './labelImage';

const RectGridConfig = {
  fill: "#ccc",
  lineWidth: 0.5,
  originX: "left",
  originY: "top",
  stroke: "#fff",
  // centeredRotation: true,
  selectable: true,
  hasControls: false,
  lockMovementX: true,
  lockMovementY: true,
};



class GridLabelImage extends LabelImage {
  constructor(options) {
    super(options);
  }
  initial = () => {
    // 多边形点选
    this.ctx.on("mouse:down", (options) => {
      try {
        const { polygonPointArray, polygonPointIndex } = this.Arrays;

        if (this.Features.polygonOn) {
          if (
            options.target &&
            options.target.name ===
              polygonPointArray[polygonPointIndex]?.[0]?.target.name
          ) {
            if (
              polygonPointArray[polygonPointIndex] &&
              polygonPointArray[polygonPointIndex].length > 1
            ) {
              this.generatePolygon(polygonPointArray[polygonPointIndex]);
              ++this.Arrays.polygonPointIndex;
            }
          } else {
            this.addPolygonPoint1(options);
          }
        }

        if (this.Features.gridOn) {
          options.target.set("fill", "red");
          this.ctx.renderAll();
        }

        if (this.Features.eraseOn) {
          options.target.set("fill", RectGridConfig.fill);
          this.ctx.renderAll();
        }
      } catch (error) {
        this.resetFeaturesAttr("polygonOn", false);
      }
    });

    this.ctx.on("mouse:up", function (options) {});
    this.ctx.on("object:moving", (options) => {
      //this.ctx.renderAll();
    });
  };

  // 设置网格线
  initGrid = (gridSize = 32) => {
    const { width, height } = this.ctx;
    let gridDistanceX = width / gridSize;
    let gridDistanceY = height / gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        let rect = new window.fabric.Rect({
          left: i * gridDistanceX,
          top: j * gridDistanceY,
          width: gridDistanceX,
          height: gridDistanceY,
          name: `grid-${i}-${j}`,
          opacity: 0.4,
          ...RectGridConfig,
        });
        this.ctx.add(rect);
      }
    }
  };

  // 点选
  addPolygonPoint1 = (options) => {
    const { polygonPointArray, polygonPointIndex } = this.Arrays;
    const arr = polygonPointArray[polygonPointIndex] || [];

    options.target.set("fill", "red");
    this.ctx.renderAll();

    if (arr && arr.length) {
      arr.push(options);
    } else {
      polygonPointArray[polygonPointIndex] = [options];
    }
  };
}

export default GridLabelImage;
