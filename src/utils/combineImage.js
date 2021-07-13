class CombineImage {
  constructor() {
    const { Point, geometry, util } = window.gpcas;
    this.PolyDefault = geometry.PolyDefault;
    this.Point = Point;
    this.geometry = geometry;
    this.util = util;
  }

  createPoly(points) {
    const res = new this.PolyDefault();
    for (let i = 0; i < points.length; i++) {
      res.addPoint(new this.Point(points[i][0], points[i][1]));
    }
    return res;
  }

  union(points1, point2) {
    console.log(points1, point2)
    const p1 = this.transformPointObjToArray(points1);
    const p2 = this.transformPointObjToArray(point2);

    const poly1 = this.createPoly(p1);
    const poly2 = this.createPoly(p2);

    const diff = poly1.union(poly2);
    return this.getPolygonPoint(diff);

    // drawPoly(diff, "green", 0, 150);
  }

  getPolygonPoint(polygon) {
    const num = polygon.getNumInnerPoly();

    const arr = [];
    for (let i = 0; i < num; i++) {
      const poly = polygon.getInnerPoly(i);
      const vertices = this.getPolygonVertices(poly);
      arr.push(vertices);
      // if (i == 0) drawSinglePoly(vertices, strokeColor, poly.isHole(), ox, oy);
      // else drawSinglePoly(vertices, colors[i % num], poly.isHole(), ox, oy);
    }
    return arr
  }

  getPolygonVertices(poly) {
    let vertices = [];
    let numPoints = poly.getNumPoints();
    let i;

    for (i = 0; i < numPoints; i++) {
      vertices.push({
        x: poly.getX(i),
        y: poly.getY(i),
      });
    }
    return vertices;
  }

  transformPointObjToArray(obj) {
    let arr = [];
    obj.forEach((item) => {
      arr.push([item.x, item.y])
    })
    return arr;
  }

  transformPointArrayToObj(arr) {
    let result = [];
    arr.forEach((item) => {
      result.push({
        x: item[0],
        y: item[1],
      })
    })
    return result;
  }
}

export default CombineImage;
