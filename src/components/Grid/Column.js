import { default as React } from 'react';

const Column = ({ component=null, style, children }) =>
  <div className="column" style={style}>
    {
      children
    }
  </div>;

export { Column };
