export const polygonConfig = {
  class: "polygon",
  fill: "rgba(255, 255, 255, 0)",
  stroke: "rgba(255, 255, 255, 0.4)",
  resultFill: "rgba(255, 255, 255, 0.4)",
  resultStroke: "rgba(255, 255, 255, 0)",
  selectable: false,
  hasBorders: false,
  evented: false,
};

export const circlePointConfig = {
  class: "circle",
  radius: 8,
  fill: "rgba(86, 151, 255, 0.8)",
  firstFill: "rgba(86, 255, 164, 0.8)",
  fillErase: "rgba(255, 86, 86, 0.8)",
  firstFillErase: "rgba(255, 86, 218, 0.8)",
  strokeWidth: 0.5,
  selectable: false,
  hasBorders: false,
  hasControls: false,
  originX: "center",
  originY: "center",
};

export const lineConfig = {
  class: "line",
  strokeWidth: 1,
  fill: "blue",
  stroke: "blue",
  originX: "center",
  originY: "center",
  selectable: false,
  hasBorders: false,
  hasControls: false,
  evented: false,
};

export const groupConfig = {
  fill: "rgba(255, 255, 255, 0.4)",
  stroke: "rgba(255, 255, 255, 0.4)",
  hasControls: true,
  selectable: true,
  hasBorders: true,
  evented: true,
  lockRotation: true,
  cornerColor: "blue",
  cornerStyle: "circle",
  cornerSize: 8,
  padding: 0,
  rotatingPointOffset: 4,
  controlVisible: {
    tl: true,
    tr: true,
    br: true,
    bl: true,
    ml: true,
    mt: true,
    mr: true,
    mb: true,
    mtr: false,
  },
};

export const rectConfig = {
  fill: "rgba(255, 255, 255, 0.4)",
  stroke: "rgba(255, 255, 255, 0.4)",
  selectable: false,
  hasBorders: false,
  evented: false,
};
