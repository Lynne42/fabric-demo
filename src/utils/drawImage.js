const polygonConfig = {
  class: "polygon",
  fill: "red",
  stroke: "blue",
  cornerStyle: "circle",
  cornerColor: "yellow",
  defaultFill: "rgba(0, 0, 0, 0.8)",
  opacity: 0.5,
  // selectable: false,
  hasBorders: false,
  // hasControls: false,
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
  constructor() {
  }
  // create canvas
  createCanvas = (canvasDom, config = {}) => {
    const canvas = new window.fabric.Canvas(canvasDom, config);
    this.canvas = canvas;
    return canvas
  };

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
  generateCircle = (points, config = {}) => {
    const circle = new window.fabric.Circle({
      ...circlePointConfig,
      left: points.x,
      top: points.y,
      name: "circle-" + points.name,
      id: "circle-" + points.name,
      ...config,
    });
    return circle;
  };

  generateRect = (points, config = {}) => {
    const rect = new window.fabric.Group(points, {
      name: "rect",
      ...config,
    });
    return rect;
  };

  generateGroup = (arr, config = {}) => {
    const group = new window.fabric.Group(arr, {
      name: "group",
      originX: "center",
      originY: "center",
      ...config,
    });
    return group;
  };

  setControl = ({ lastControl, index, }) => {

    return new window.fabric.Control({
      positionHandler: this.polygonPositionHandler,
      actionHandler: this.anchorWrapper(
        index > 0 ? index - 1 : lastControl,
        this.actionHandler
      ),
      actionName: "modifyPolygon",
      pointIndex: index,
    });
  };

  editPolygon = (poly) => {
    console.log(4544, this.canvas)
    this.canvas.setActiveObject(poly);
    let lastControl = poly.points.length - 1;
    poly.cornerStyle = "circle";
    poly.cornerColor = "rgba(0,0,255,0.5)";
    poly.controls = poly.points.reduce(function (acc, point, index) {
      acc["p" + index] = this.setControl({
        index,
        lastControl,
      });
      return acc;
    }, {});
  };

  polygonPositionHandler = (dim, finalMatrix, fabricObject) => {
    var x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
      y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
    return window.fabric.util.transformPoint(
      { x: x, y: y },
      window.fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix()
      )
    );
  };

  anchorWrapper = (anchorIndex, fn) => {
    return function (eventData, transform, x, y) {
      var fabricObject = transform.target,
        absolutePoint = window.fabric.util.transformPoint(
          {
            x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
          },
          fabricObject.calcTransformMatrix()
        ),
        actionPerformed = fn(eventData, transform, x, y),
        newDim = fabricObject._setPositionDimensions({}),
        polygonBaseSize = fabricObject._getNonTransformedDimensions(),
        newX =
          (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
          polygonBaseSize.x,
        newY =
          (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
          polygonBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  };
}

export default DrawImage;

export { polygonConfig, circlePointConfig, lineConfig };
