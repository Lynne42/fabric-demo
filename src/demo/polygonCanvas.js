import React, { useMemo, useEffect, useRef, useState } from "react";
// import { fabric } from "fabric";
import "./polygonCanvas.css";

import PolygonLabelImage from '../utils/polygonLabelImage';

const FabricPolygonComponent = () => {
  const canvasRef = useRef(null);

  const [canvas, setcanvas] = useState(null);
  // const [type, settype] = useState('')

  useEffect(() => {
    const canvasContent = canvasRef.current;

    const initCanvas = new PolygonLabelImage({
      canvas: canvasContent,
      canvasConfig: {
        height: 320,
        width: 320,
        // selection: false,
        // centeredScaling: false,
        // selectable: false,
        // hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        globalAlpha: 0,
        // preserveObjectStacking: true,
        // hasBorders: false,
      },
    });

    initCanvas.perPixelTargetFind = true;
    initCanvas.resetFeaturesAttr("polygonOn", true);

    setcanvas(initCanvas);
    initCanvas.setImage("https://i.ibb.co/cXKy30V/Rectangle-139.png");

  }, []);

  const type = useMemo(() => {
    return canvas ? Object.keys(canvas.Features).filter(item => canvas.Features[item])[0] : ''
  }, [canvas]);
  console.log(3433, type, canvas)

  const handleDrag = () => {
    canvas.resetFeaturesAttr("dragOn", true);
  }
  const handlePolygon = () => {
    canvas.resetFeaturesAttr("polygonOn", true);
  };

  const handleErase = () => {
    canvas.resetFeaturesAttr("eraseOn", true);
  };

  return (
    <div className="container">
      <div className="polygonCanvasView">
        <canvas ref={canvasRef} width="320" height="320" className="canvas">
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
      </div>

      <div>

        {/* <button
          className={type === "dragOn" ? "active" : ""}
          onClick={handleDrag}
        >
          drag
        </button> */}
        <button
          className={type === "polygonOn" ? "active" : ""}
          onClick={handlePolygon}
        >
          Area Select
        </button>
        <button
          className={type === "eraseOn" ? "active" : ""}
          onClick={handleErase}
        >
          Area Erase
        </button>
      </div>
    </div>
  );
};

export default FabricPolygonComponent;
