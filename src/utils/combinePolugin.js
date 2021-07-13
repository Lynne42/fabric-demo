class CombinePolygon {
  constructor(props) {
    super(props);
    this.gpcas = window.gpcas;
    this.PolyDefault = this.gpcas.geometry.PolyDefault;
  }

  createPoly(points) {
    const res = new this.PolyDefault();
    for (let i = 0; i < points.length; i++) {
      res.addPoint(new this.gpcas.Point(points[i][0], points[i][1]));
    }
    return res;
  }

  union(points1, point2) {
    const poly1 = this.createPoly(points1);
    const poly2 = this.createPoly(point2);

    const diff = poly1.union(poly2);
    drawPoly(diff, "green", 0, 150);
  }
}

export default CombinePolygon;
