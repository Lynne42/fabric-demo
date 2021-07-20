import React, { useMemo, useEffect, useRef, useState } from "react";
// import { fabric } from "fabric";
import "./polygonCanvas.css";

import PolygonLabelImage from "../utils/polygonLabelImage";
import PresetAreaAction from "../component/presetArea";

const FabricPolygonComponent = () => {
  const canvasRef = useRef(null);

  const [canvas, setcanvas] = useState(null);
  const [type, settype] = useState("polygonOn");
  const [value, setvalue] = useState(2);

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

  const handlePolygon = () => {
    settype("polygonOn");
    canvas.clearNoPolygon();
    canvas.splitGroup();
    canvas.resetFeaturesAttr("polygonOn", true);
  };
  const handleErase = () => {
    settype("eraseOn");
    canvas.clearNoPolygon();
    canvas.splitGroup();
    canvas.resetFeaturesAttr("eraseOn", true);
  };
  const handleDownload = () => {
    settype("downOn");
    canvas.clearNoPolygon();
    canvas.splitGroup();
    canvas.resetFeaturesAttr("downOn", true);
    canvas.handleToDataURL();
  };

  const handleDrag = () => {
    settype("dragOn");
    canvas.clearNoPolygon();
    canvas.resetFeaturesAttr("dragOn", true);

    canvas.toGroup();
  };

  const handleDragAction = (type) => {
    canvas.moveDragByKeyboard(type, value);
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
          {type === "dragOn" && (
            <div className="drag-action">
              <div>
                <span onClick={() => handleDragAction("top")}>上</span>
                <span onClick={() => handleDragAction("bottom")}>下</span>
              </div>
              <input
                type="number"
                onChange={(e) => setvalue(e.target.value)}
                value={value}
                min={1}
                max={100}
              />
              <div>
                <span onClick={() => handleDragAction("left")}>左</span>
                <span onClick={() => handleDragAction("right")}>右</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div>
        <PresetAreaAction/>
      </div> */}
    </div>
  );
};

export default FabricPolygonComponent;
