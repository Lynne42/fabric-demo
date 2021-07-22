import React from "react";

import CommonTitle from "../atom/title";
import { areaImage, areaWearables, areaFeatures } from "../constant/config";

interface props {
  onClick: (name: string, radio?: number) => void;
  type: string;
}

const PresetAreaAction: React.FunctionComponent<props> = ({
  type,
  onClick,
}) => {

  const handleClick = (name: string, radio?: number) => {
    onClick(name, radio);
  };

  return (
    <section>
      <CommonTitle title={"Images"} />
      <ul className="group">
        {areaImage.map((item) => (
          <li
            key={item.name}
            onClick={() => handleClick(item.name, item.ratio)}
            className='group-item'>
            {item.name}
          </li>
        ))}
      </ul>
      <CommonTitle title={"Wearables"} />
      <ul className="group">
        {areaWearables.map((item) => (
          <li
            key={item}
            onClick={() => handleClick(item)}
            className='group-item'
          >
            {item}
          </li>
        ))}
      </ul>
      <CommonTitle title={"Features"} />
      <ul className="group">
        {areaFeatures.map((item) => (
          <li
            key={item}
            onClick={() => handleClick(item)}
            className='group-item'
            >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
};
export default PresetAreaAction;
