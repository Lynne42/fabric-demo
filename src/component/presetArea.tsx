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
  const isNone = type === "None";

  console.log(111, type)

  const handleClick = (name: string, radio?: number) => {
    if(!type || (name === 'None') || (type && type === 'None')) {
      onClick(name, radio);
      return
    } else if (name === type) {
      return;
    }
  };

  return (
    <section>
      <CommonTitle title={"Images"} />
      <ul className="group">
        {areaImage.map((item) => (
          <li
            key={item.name}
            onClick={() => handleClick(item.name, item.ratio)}
            className={`group-item ${!isNone && type && type !== item.name && item.name !== 'None'  ? 'group-item-disabled' : ''  }`}
          >
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
            className={`group-item ${!isNone && type && type !== item ? 'group-item-disabled' : ''}`}
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
            className={`group-item ${!isNone && type && type !== item ? 'group-item-disabled' : ''}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
};
export default PresetAreaAction;
