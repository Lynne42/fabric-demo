interface areaImageType {
  name: string;
  ratio: number;
}

type areaWearablesType = string[];

export const areaImage: areaImageType[] = [
  {
    name: 'All',
    ratio: 1,
  }, {
    name: 'None',
    ratio: 0,
  }, {
    name: 'Center (70%)',
    ratio: 0.7,
  }, {
    name: 'Center (50%)',
    ratio: 0.5,
  }, {
    name: 'Center (30%)',
    ratio: 0.3,
  }, {
    name: 'Center (10%)',
    ratio: 0.1,
  }
]

export const areaWearables: areaWearablesType = [
  'Glasses',
  'Mask',
  'Sticker',
]

export const areaFeatures: areaWearablesType = [
  'Face',
  'Mouth',
  'Eyes',
  'Nose',
  'Cheek',
  'Forehead'
]

