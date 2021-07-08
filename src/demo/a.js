function changeAction(target) {
  ["select", "erase", "draw", "spray"].forEach((action) => {
    const t = document.getElementById(action);
    t.classList.remove("active");
  });
  if (typeof target === "string") target = document.getElementById(target);
  target.classList.add("active");
  switch (target.id) {
    case "select":
      canvas.isDrawingMode = false;
      break;
    case "erase":
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.freeDrawingBrush.width = 10;
      canvas.isDrawingMode = true;
      break;
    case "draw":
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 35;
      canvas.isDrawingMode = true;
      break;
    case "spray":
      canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
      canvas.freeDrawingBrush.width = 35;
      canvas.isDrawingMode = true;
      break;
    default:
      break;
  }
}
function init() {
  canvas.setOverlayColor("rgba(0,0,255,0.4)", undefined, { erasable: false });

  fabric.Image.fromURL(
    "https://ip.webmasterapi.com/api/imageproxy/http://fabricjs.com/assets/mononoke.jpg",
    function (img) {
      img.scaleToWidth(480);

      // img.set({ opacity: 0.7 });

      canvas.setBackgroundImage(img);
      img.set({ erasable: false });
      canvas.on("erasing:end", ({ targets, drawables }) => {
        var output = document.getElementById("output");
        output.innerHTML = JSON.stringify(
          {
            objects: targets.map((t) => t.type),
            drawables: Object.keys(drawables),
          },
          null,
          "\t"
        );
      });
      canvas.renderAll();
    },
    { crossOrigin: "anonymous" }
  );
}


const canvas = (this.__canvas = new fabric.Canvas("c"));
init();
changeAction("erase");
