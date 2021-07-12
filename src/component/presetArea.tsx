import React from 'react';

import CommonTitle from '../atom/title';
import { areaImage, areaWearables, areaFeatures } from '../constant/config';

interface props {};

const PresetAreaAction: React.FunctionComponent<props> = () => {
  return (
    <section>
      <CommonTitle title={'Images'}/>
      <ul className="">
        {
          areaImage.map(item => <li key={item.name}>{item.name}</li>)
        }
      </ul>
      <CommonTitle title={'Wearables'}/>
      <ul className="">
        {
          areaWearables.map(item => <li key={item}>{item}</li>)
        }
      </ul>
      <CommonTitle title={'Features'}/>
      <ul className="">
        {
          areaFeatures.map(item => <li key={item}>{item}</li>)
        }
      </ul>
    </section>
  );
};
export default PresetAreaAction;

