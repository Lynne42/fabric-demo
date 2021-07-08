import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

const FabricImageComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCTX] = useState<any>(null);

  useEffect(() => {
    const canvasContent = canvasRef.current;
    const canvas = new fabric.Canvas(canvasContent, {
      selection: false,
      height: 320,
      width: 320,
    });
    setCTX(canvas);
    fabric.Image.fromURL(
      "https://i.ibb.co/cXKy30V/Rectangle-139.png",
      function (oImg) {
        canvas.add(oImg);
      }
    );
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="320"
      height="320"
      className="canvas1"
    >
      您的浏览器不支持canvas，请更换浏览器.
    </canvas>
  );
};

export default FabricImageComponent;

/*
使用group后， 会将组内的元素定义为一个对象， 操作只能针对这一个对象
*/
