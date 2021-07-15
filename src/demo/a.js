
function fn1() {
  var canvas = window._canvas = new fabric.Canvas('c', {
    width: 320,
    height: 320,
  });

 var circle = new fabric.Circle({
    radius: 50,
    top: 50,
    left: 50,
   fill: 'green'
  });
  var rect = new fabric.Rect({
    width: 50,
    height: 50,
    left: 110,
    top: 100,
    fill: 'red',
  });
  var rect2 = new fabric.Rect({
    width: 30,
    height: 30,
    left: 120,
    top: 110,
    globalCompositeOperation: 'destination-out',
  });

  canvas.add(circle);
  canvas.add(rect);
  canvas.add(rect2);
}

function fn2() {
  var canvas2 = window._canvas = new fabric.Canvas('c2', {
    width: 320,
    height: 320,
  });
  setImage('https://i.ibb.co/cXKy30V/Rectangle-139.png')

  var rect = new fabric.Rect({
    width: 50,
    height: 50,
    left: 110,
    top: 100,
    fill: 'red',
  });
  var rect2 = new fabric.Rect({
    width: 30,
    height: 30,
    left: 120,
    top: 110,
    globalCompositeOperation: 'destination-out',
  });

  canvas2.add(rect);
  canvas2.add(rect2);
  canvas2.on("mouse:wheel", (e) => handleZoom(canvas2, e));


  function setImage(imgsrc) {
    fabric.Image.fromURL(
      imgsrc,
      function (img) {
        img.set({
          left: 0,
          top: 0,
          originX: "left",
          originY: "top",
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          name: "bg-img",
        });
        canvas2.setBackgroundImage(
          img,
          canvas2.renderAll.bind(canvas2)
        );
      },
      { crossOrigin: "anonymous" }
    );
  }
}

function handleZoom(canvas, opt) {
    const delta = opt.e.deltaY;
    let zoom = (delta > 0 ? -0.1 : 0.1) + canvas.getZoom();
    zoom = Math.max(0.2, zoom);
    zoom = Math.min(8, zoom);
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
}

fn1()

fn2()
