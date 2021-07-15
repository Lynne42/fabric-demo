import React, { useMemo, useEffect, useRef, useState } from "react";
// import { fabric } from "fabric";
import "./polygonCanvas.css";

import PolygonLabelImage from "../utils/polygonLabelImage";
import PresetAreaAction from '../component/presetArea';

const FabricPolygonComponent = () => {
  const canvasRef = useRef(null);

  const [canvas, setcanvas] = useState(null);
  const [type, settype] = useState('polygonOn')

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
        // hasBorders: false,
        // objectCaching: true,
        lockMovementX: true,
        lockMovementY: true,
        // preserveObjectStacking: true,
      },
    });

    initCanvas.resetFeaturesAttr("polygonOn", true);

    setcanvas(initCanvas);
    initCanvas.setImage("https://i.ibb.co/cXKy30V/Rectangle-139.png");
  }, []);

  const handleDrag = () => {
    settype("dragOn")
    canvas.resetFeaturesAttr("dragOn", true);
  };
  const handlePolygon = () => {
    settype("polygonOn")
    canvas.resetFeaturesAttr("polygonOn", true);
  };
  const handleErase = () => {
    settype("eraseOn")
    canvas.resetFeaturesAttr("eraseOn", true);
  };
  const handleDownload = () => {
    settype("downOn")
    canvas.resetFeaturesAttr("downOn", true);
    canvas.handleToDataURL();
  };

  return (
    <div className="container">
      <div>
        <div className="polygonCanvasView">

          <canvas ref={canvasRef} width="320" height="320" className="canvas">
            您的浏览器不支持canvas，请更换浏览器.
          </canvas>
        </div>
        <div>

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

          <button
            className={type === "dragOn" ? "active" : ""}
            onClick={handleDrag}
          >
            drag
          </button>

          <button
            className={type === "downOn" ? "active" : ""}
            onClick={handleDownload}
          >
            result
          </button>
        </div>

      </div>
      {/* <div>
        <PresetAreaAction/>
      </div> */}
    </div>
  );
};

export default FabricPolygonComponent;
