import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./dragCanvas.module.css";

const FabricDragComponent = () => {
  const canvasRef = useRef(null);
  let [canvas, setcanvas] = useState(null);
  const [type, settype] = useState("draw");

  // 切换操作
  const handleAction = useCallback(
    (ctx, actionType) => {
      switch (actionType) {
        case "select":
          ctx.isDrawingMode = false;
          break;
        case "erase":
          ctx.freeDrawingBrush = new window.fabric.EraserBrush(ctx);
          ctx.freeDrawingBrush.width = 10;
          ctx.isDrawingMode = true;
          break;
        case "draw":
          ctx.freeDrawingBrush = new window.fabric.PencilBrush(ctx);
          ctx.freeDrawingBrush.width = 10;
          ctx.alpha = 4;
          ctx.freeDrawingBrush.color = '#fff';
          ctx.freeDrawingBrush.strokeLineJoin = 'bevel';
          ctx.isDrawingMode = true;
          break;
        default:
          break;
      }
    },
    [],
  );

  useEffect(() => {
    const canvasContent = canvasRef.current;
    const ctx = new window.fabric.Canvas(canvasContent, {
      selection: false,
      height: 600,
      width: 600,
    });
    ctx.setOverlayColor("rgba(0,0,0,0)", undefined, { erasable: false });

    // 设置背景图片
    window.fabric.Image.fromURL(
      "https://i.ibb.co/cXKy30V/Rectangle-139.png",
      function (img) {
        img.set({
          // 通过scale来设置图片大小，这里设置和画布一样大
          scaleX: ctx.width / img.width,
          scaleY: ctx.height / img.height,
          erasable: false,
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
        });
        ctx.setBackgroundImage(img, ctx.renderAll.bind(ctx));

        ctx.renderAll();
      },
      { crossOrigin: "anonymous" }
    );

    // 缩放
    ctx.on("mouse:wheel", function (e) {
      console.log(222, e)
      let zoom = (e.deltaY > 0 ? -0.1 : 0.1) + ctx.getZoom();
      zoom = Math.max(0.1, zoom);
      zoom = Math.min(3, zoom);
      let zoomPoint = new window.fabric.Point(400, 120);
      ctx.zoomToPoint(zoomPoint, zoom);
    });

    handleAction(ctx, 'draw')
    setcanvas(ctx);
  }, [handleAction]);


  const handleDraw = () => {
    settype("draw");
    handleAction(canvas, 'draw');
  };

  const handleErase = () => {
    settype("erase");
    handleAction(canvas, 'erase');
  };

  return (
    <div>
      <div>1</div>
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
          className={type === "draw" ? styles.active : ""}
          onClick={handleDraw}
        >
          draw
        </button>
        <button
          className={type === "erase" ? styles.active : ""}
          onClick={handleErase}
        >
          erase
        </button>

        <button
          className={type === "draw" ? styles.active : ""}
          onClick={handleDraw}
        >
          draw
        </button>
      </div>
    </div>
  );
};

export default FabricDragComponent;

// 设置背景图
// canvas.setBackgroundImage(
//   "https://i.ibb.co/cXKy30V/Rectangle-139.png",
//   canvas.requestRenderAll.bind(canvas),
//   {
//     top: 0,
//     left: 0,
//   }
// );
