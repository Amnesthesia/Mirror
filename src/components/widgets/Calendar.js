import { default as React } from 'react';

require('styles/components/widgets/Calendar.scss');

const Calendar = ({ positionVertical=false, headerFontSize, bodyFontSize }) => {

  const year = new Date().getFullYear();
  const day = new Date().getDate();

  return(
    <div className="calendar">
      <div className="calendar-header" style={{ fontSize: headerFontSize }}>{year}</div>
      <div className="calendar-body" style={{ fontSize: bodyFontSize }}>{day}</div>
    </div>
  );
};

export { Calendar };
