const polygonConfig = {
  class: "polygon",
  fill: "rgba(255, 255, 255, 0.4)",
  stroke: "rgba(255, 255, 255, 0.4)",
  cornerStyle: "circle",
  cornerColor: "yellow",
  // opacity: 0.5,
  selectable: false,
  hasBorders: false,
  hasControls: false,
  evented: false,
};

const circlePointConfig = {
  class: "circle",
  radius: 10,
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

export const INTERSECT = 'intersect'
export const CONTAIN = 'contain'

class DrawImage {
  // create canvas
  createCanvas(canvasDom, config = {}) {
    const canvas = new window.fabric.Canvas(canvasDom, config);
    this.canvas = canvas;
    return canvas;
  }

  // draw line
  generateLine(points, config = {}) {
    const line = new window.fabric.Line(points, {
      ...lineConfig,
      ...config,
    });
    return line;
  }

  // draw polygon
  generatePolygon(points, config = {}) {
    const polygon = new window.fabric.Polygon(points, {
      ...polygonConfig,
      ...config,
    });
    return polygon;
  }

  // draw circle
  generateCircle(points, config = {}) {
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

  generateRect(points, config = {}) {
    const rect = new window.fabric.Group(points, {
      name: "rect",
      ...config,
    });
    return rect;
  }

  generateGroup(arr, config = {}) {
    const group = new window.fabric.Group(arr, {
      name: "group",
      originX: "center",
      originY: "center",
      opacity: 0.5,
      ...config,
    });
    return group;
  }

  // Get intersecting and non-intersecting or included and non-included graph row data
  getIntersectsOrContainResult(polyArr, targetPoly, type) {
    const intersectsArr = [];
    const resultPoly = [];
    const fn = type === INTERSECT ? this.isIntersectsWithObject : this.isContainedWithinObject;

    for(let i = 0, len = polyArr.length; i< len; i++) {
      if(fn(polyArr[i], targetPoly)) {
        intersectsArr.push(polyArr[i])
      } else {
        resultPoly.push(polyArr[i]);
      }
    }
    return {
      intersectionArr: intersectsArr,
      noIntersectionArr: resultPoly
    }
  }

  getContainResult(polyArr, targetPoly) {
    const intersectsArr = [];
    const resultPoly = [];
    const fn = this.isContainedWithinObject;

    let countPositive = 0;
    let countNegative = 0;

    for(let i = 0, len = polyArr.length; i< len; i++) {
      if(fn(polyArr[i], targetPoly)) {
        resultPoly.push(polyArr[i]);
        countPositive += 1;
      } else if(fn(targetPoly, polyArr[i])) {

        resultPoly.push(targetPoly);
      } else {
        resultPoly.push(polyArr[i]);
        resultPoly.push(targetPoly);
      }
    }
    return {
      polygon: resultPoly,
      polygonHole: countPositive ? [targetPoly] : []
    }
  }

  getContainResultCombine(polyArr, targetPoly) {
    const intersectsArr = [];
    const resultPoly = [];
    let count = 0;

    for(let i = 0, len = polyArr.length; i< len; i++) {
      if(this.isContainedWithinObject(polyArr[i], targetPoly)) {
        count +=1;
      } else if(this.isContainedWithinObject(targetPoly, polyArr[i])) {
        resultPoly.push(polyArr[i]);
      } else {
        resultPoly.push(polyArr[i]);
      }
    }

    return {
      intersectionArr: targetPoly,
      noIntersectionArr: resultPoly
    }
  }


  // Determine whether there is an intersection between two graphics
  isIntersectsWithObject(poly1, poly2) {
    return poly1.intersectsWithObject(poly2)
  }

  // Determine whether the two graphics are in a containment relationship
  isContainedWithinObject(poly1, poly2) {
    // Only judge whether the original image contains the target image
    return poly2.isContainedWithinObject(poly1)
  }

  editPolygon(poly) {
    const that = this;
    this.canvas.setActiveObject(poly);
    let lastControl = poly.points.length - 1;
    poly.cornerStyle = "circle";
    poly.cornerColor = "yellow";
    poly.controls = poly.points.reduce(function (acc, point, index) {
      acc["p" + index] = that.setControl({
        index,
        lastControl,
      });
      return acc;
    }, {});
  }

  setControl({ lastControl, index }) {
    const that = this;
    return new window.fabric.Control({
      positionHandler: that.polygonPositionHandler,
      actionHandler: that.anchorWrapper(
        index > 0 ? index - 1 : lastControl,
        that.actionHandler
      ),
      actionName: "modifyPolygon",
      pointIndex: index,
    });
  }

  polygonPositionHandler(dim, finalMatrix, fabricObject) {
    let x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
      y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
    return window.fabric.util.transformPoint(
      { x: x, y: y },
      window.fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix()
      )
    );
  }

  actionHandler(eventData, transform, x, y) {
    let polygon = transform.target,
      currentControl = polygon.controls[polygon.__corner],
      mouseLocalPosition = polygon.toLocalPoint(
        new window.fabric.Point(x, y),
        "center",
        "center"
      ),
      polygonBaseSize = polygon._getNonTransformedDimensions(),
      size = polygon._getTransformedDimensions(0, 0),
      finalPointPosition = {
        x:
          (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
          polygon.pathOffset.x,
        y:
          (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
          polygon.pathOffset.y,
      };
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    return true;
  }

  anchorWrapper(anchorIndex, fn) {
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
  }


}

export default DrawImage;

export { polygonConfig, circlePointConfig, lineConfig };
