// https://blog.csdn.net/weixin_45265581/article/details/106436683
export const polygonConfig = {
  class: "polygon",
  fill: "rgba(255, 255, 255, 0.4)",
  fillOpcity: "rgba(255, 255, 255, 0)",
  resultFill: "rgba(255, 255, 255, 0.4)",
  strokeDashArray: [5,5,5,5],
  selectable: false,
  hasBorders: false,
  evented: false,
};


export const circlePointConfig = {
  class: "circle",
  radius: 4,
  fill: "rgba(86, 151, 255, 0.8)",
  firstFill: "rgba(86, 255, 164, 0.8)",
  fillErase: "rgba(255, 86, 86, 0.8)",
  firstFillErase: "rgba(255, 86, 218, 0.8)",
  lockScalingX: true,
  lockScalingY: true,
  lockScalingFlip: true,
  noScaleCache: true,
  selectable: false,
  hasBorders: false,
  hasControls: false,
  scaleX: 1,
  scaleY: 1,
  originX: "center",
  originY: "center",
};

export const lineConfig = {
  class: "line",
  fill: "blue",
  stroke: "blue",
  originX: "center",
  originY: "center",
  selectable: false,
  hasBorders: false,
  hasControls: false,
  evented: false,
  strokeDashArray: [5,5,5,5],
};

export const groupConfig = {
  hasControls: false,
  selectable: true,
  hasBorders: false,
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
