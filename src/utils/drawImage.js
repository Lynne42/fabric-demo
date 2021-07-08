const polygonConfig = {
  class: "polygon",
  fill: "red",
  stroke: "blue",
  cornerStyle: "circle",
  cornerColor: "yellow",
  defaultFill: "rgba(0, 0, 0, 0.8)",
  // opacity: 0.5,
  selectable: false,
  hasBorders: false,
  hasControls: false,
  evented: false,
};

const circlePointConfig = {
  class: "circle",
  radius: 5,
  fill: "rgba(86, 151, 255, 0.5)",
  firstFill: "rgba(86, 255, 164, 0.5)",
  strokeWidth: 0.5,
  selectable: false,
  hasBorders: false,
  hasControls: false,
  originX: "center",
  originY: "center",
};

const lineConfig = {
  class: "line",
  strokeWidth: 1,
  fill: "blue",
  stroke: "blue",
  originX: "center",
  originY: "center",
  selectable: false,
  hasBorders: false,
  hasControls: false,
  evented: false,
};

class DrawImage {
  constructor(canvas) {
    this.canvas = canvas;
  }
  // create canvas
  createCanvas = (canvasDom, config={}) => {
    return new window.fabric.Canvas(canvasDom, config)
  }

  // draw line
  generateLine = (points, config = {}) => {
    const line = new window.fabric.Line(points, {
      ...lineConfig,
      ...config,
    });
    return line;
  };

  // draw polygon
  generatePolygon = (points, config = {}) => {
    const polygon = new window.fabric.Polygon(points, {
      ...polygonConfig,
      ...config,
    });
    return polygon;
  };

  // draw circle
  generateCircle = (points, config={}) => {
    const circle = new window.fabric.Circle({
      ...circlePointConfig,
      left: points.x,
      top: points.y,
      name: "circle-" + points.name,
      id: "circle-" + points.name,
      ...config,
    });
    return circle;
  }
}

export default DrawImage;

export { polygonConfig, circlePointConfig, lineConfig };
