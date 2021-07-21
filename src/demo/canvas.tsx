import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import "./canvas.css";

// import FabricImageComponent from "./image";

const options = {
  gridSize: 32,
  distance: 10,
  param: {
    fill: "#ccc",
    lineWidth: 0.5,
    originX: "left",
    originY: "top",
    stroke: "#fff",
    centeredRotation: true,
    selectable: true,
    hasControls: false,
    lockMovementX: true,
    lockMovementY: true,
  },
};

const FabricComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCTX] = useState<any>(null);

  // 获取canvas大小
  const getCanvasSize = useCallback(() => {
    const width = canvasRef!.current!.width;
    const height = canvasRef!.current!.height;
    return {
      width,
      height,
    };
  }, [canvasRef]);

  const drawGrid = useCallback(
    (currentCanvasWidth, currentcanvasHeight) => {
      // Drawing vertical lines
      let gridDistanceX = currentCanvasWidth / options.gridSize;
      let gridDistanceY = currentcanvasHeight / options.gridSize;

      for (let i = 0; i < options.gridSize; i++) {
        for (let j = 0; j < options.gridSize; j++) {
          let rect = new fabric.Rect({
            left: i * gridDistanceX,
            top: j * gridDistanceY,
            width: gridDistanceX,
            height: gridDistanceY,
            ...options.param,
          });
          if (!!ctx) {
            ctx.add(rect);
          }
        }
      }
    },
    [ctx]
  );

  useEffect(() => {
    const canvasContent = canvasRef.current;
    const canvas = new fabric.Canvas(canvasContent, {
      selection: false,
      height: 600,
      width: 600,
    });
    fabric.Image.fromURL(
      "https://i.ibb.co/cXKy30V/Rectangle-139.png",
      function (oImg) {
        canvas.add(oImg);
      },  { crossOrigin: 'anonymous' }
    );

    setCTX(canvas);
  }, []);

  useEffect(() => {
    if (ctx) {
      const { width, height } = getCanvasSize();
      // ctx.globalAlpha = 0.1;
      // drawGrid(width, height);
    }
  }, [ctx, drawGrid, getCanvasSize]);

  return (
    <div>
      <img
        src="https://i.ibb.co/cXKy30V/Rectangle-139.png"
        alt="img"
        className="img"
      />

      <div>1</div>
      <div className="canvas-view">
        {/* <FabricImageComponent /> */}
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

      {/* <div>2</div>
      <div className="canvas-view">
        <img
          src="https://i.ibb.co/cXKy30V/Rectangle-139.png"
          alt="img"
          className="img"
        />
        <canvas
          ref={canvasRef}
          width="600"
          height="600"
          className="canvas"
        >
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
      </div> */}
    </div>
  );
};

export default FabricComponent;
