import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";


const FabricRectComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCTX] = useState<any>(null);

  useEffect(() => {
    const canvasContent = canvasRef.current;
    const canvas = new fabric.Canvas(canvasContent, {
      selection: false,
      height: 600,
      width: 600,
    });
    setCTX(canvas);
    const rect = new fabric.Rect({
      width: 200,
      height: 100,
      rx: 20,
      ry: 20,
      fill: '#FF4D4F'
    })
    const text = new fabric.IText('blackstar', {
      fontFamily: 'Calibri',
      fontSize: 18,
      originX: 'center',
      originY: 'center',
      centeredRotation: true,
      fill: '#fff'
    })
    const block = new fabric.Group([rect,text], {
      left: 50,
      top: 50
    })
    canvas.add(block)
  }, []);


  return (
    <div>

      <div className="canvas-view">

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
    </div>
  );
};

export default FabricRectComponent;

/*
使用group后， 会将组内的元素定义为一个对象， 操作只能针对这一个对象
*/
