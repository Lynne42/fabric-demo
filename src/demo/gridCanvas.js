import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./dragCanvas.module.css";

import GridLabelImage from '../utils/gridLabelImage';

const FabricGridComponent = () => {
  const canvasRef = useRef(null);
  let [canvas, setcanvas] = useState(null);
  const [type, settype] = useState("");


  useEffect(() => {
    const canvasContent = canvasRef.current;
    const initCanvas = new GridLabelImage({
      canvas: canvasContent,
      ctx: new window.fabric.Canvas(canvasContent, {
        height: 600,
        width: 600,
        selection: false,
        centeredScaling: true,
      }),
    });

    initCanvas.initial();
    initCanvas.initGrid(32);

    setcanvas(initCanvas);
    initCanvas.setImage("https://i.ibb.co/cXKy30V/Rectangle-139.png");
  }, []);

  const handleGridPoint = () => {
    settype("grid");
    canvas.resetFeaturesAttr("gridOn", true);
  };

  const handleErase = () => {
    settype("erase");
    canvas.resetFeaturesAttr("eraseOn", true);
  };

  const handleGridPolygon = () => {
    settype("areapolygon");
    canvas.resetFeaturesAttr("polygonOn", true);
  };

  return (
    <div>
      <div>3</div>
      <div className={styles.canvasView}>
        <canvas
          ref={canvasRef}
          width="600"
          height="600"
          className="canvas"
          id="my-canvas"
        >
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
      </div>
      <div>
        <button
          className={type === "grid" ? styles.active : ""}
          onClick={handleGridPoint}
        >
          grid
        </button>
        <button
          className={type === "areaerase" ? styles.active : ""}
          onClick={handleErase}
        >
          grid erase
        </button>

        <button
          className={type === "areapolygon" ? styles.active : ""}
          onClick={handleGridPolygon}
        >
          area polygon
        </button>
      </div>
    </div>
  );
};

export default FabricGridComponent;

