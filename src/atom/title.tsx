import React from 'react';

interface PropsType {
  title: string;
}

const CommonTitle: React.FunctionComponent<PropsType> = (props) => {
  const { title } = props;
  return (
    <h2>{title}</h2>
  );
};
export default CommonTitle;
