import * as d3 from 'd3';
import { wheelData } from './DonutWheelData';

export const getDegreeFromDay = (dayOfYear) => (365 / 360) * dayOfYear;

export const getDayOfYear = (date) => {
  let start: any = new Date(date.getFullYear(), 0, 0);
  let diff: any =
    date -
    start +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  let oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay);

  return day;
};

export const dateWithoutTime = (date) => {
  let today = new Date(date).toISOString().slice(0, 10);

  return today;
};

// Calculate cartesian points in circle
export const getXY = (radius, angle, origin) => {
  const y = radius * Math.sin((-angle * Math.PI) / 180) + origin;
  const x = radius * Math.cos((-angle * Math.PI) / 180) + origin;

  return { x, y };
};

export const calcAngleDegrees = (fromX, fromY, toX, toY, force360 = true) => {
  let deltaX = fromX - toX;
  let deltaY = fromY - toY; // reverse
  let radians = Math.atan2(deltaY, deltaX);
  let degrees = (radians * 180) / Math.PI - 90; // rotate
  if (force360) {
    while (degrees >= 360) degrees -= 360;
    while (degrees < 0) degrees += 360;
  }
  console.log('angle to degree:', { deltaX, deltaY, radians, degrees });
  return degrees;
};

export const getCentroid = (innerRadius, outerRadius, startAngle, endAngle) => {
  const r = (+innerRadius + +outerRadius) / 2;
  const a = (+startAngle + +endAngle) / 2 - Math.PI / 2;

  return [Math.cos(a) * r, Math.sin(a) * r];
};

export const drawArc = (
  innerRadius: number,
  outerradius: number,
  item,
  title: string,
  colour: string
) => {
  const arc = d3.arc();
  return {
    arcSvg: arc({
      innerRadius: innerRadius,
      outerRadius: outerradius,
      startAngle: getDegreeFromDay(item.startDay) * (Math.PI / 180),
      endAngle: getDegreeFromDay(item.endDay) * (Math.PI / 180),
    }),
    color: colour,
    title: title,
  };
};

export const drawText = (arr: any[], rotate: number, svgEl) => {
  arr.forEach((coord, index) => {
    svgEl
      .append('text')
      .attr('x', coord.coords.x)
      .attr('y', coord.coords.y)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-family', 'sans-serif')

      .text(coord.title)
      .attr(
        'transform',
        `rotate(${rotate + (360 / arr.length) * (arr.length - index)}, ${
          coord.coords.x
        }, ${coord.coords.y})`
      );
  });
};

export const addWheeldata = (innerradius, outerRadius, colour, category) => {
  wheelData.push({
    innerRadius: innerradius,
    outerRadius: outerRadius,
    startAngle: getDegreeFromDay(0) * (Math.PI / 180),
    endAngle: getDegreeFromDay(360) * (Math.PI / 180),
    color: colour.Colour,
    arcSvg: undefined,
    category: category.Category,
  });
};

export const populateArr = (
  arr,
  divider: number,
  radius: number,
  text?: string
) => {
  for (let i = 0; i < 360; i += 360 / divider) {
    arr.push({
      coords: getXY(radius, i, 500),
    });
  }
};

export const populateMonthsArrUpper = (
  arr,
  divider: number,
  angel: number,
  text: string[]
) => {
  let index = 0;
  let realIndex = 11;
  for (let i = 0; i <= 360; i += 360 / divider) {
    index++;
    if (index % 2 == 0) {
      arr.push({
        title: text[realIndex] || '',
        coords: getXY(488, i - angel, 500),
        angle: i,
      });
      realIndex--;
    }
  }
};

export const populateMonthsArrLower = (
  arr,
  divider: number,
  angel: number,
  text: string[]
) => {
  let index = 0;
  let realIndex = 11;
  for (let i = 0; i <= 360; i += 360 / divider) {
    index++;
    if (index % 2 == 0) {
      arr.push({
        title: text[realIndex] || '',
        coords: getXY(497, i - angel, 500),
        angle: i,
      });
      realIndex--;
    }
  }
};

export const populateWeeksUpper = (
  arr,
  divider: number,
  angel: number,
  text: string[]
) => {
  let realIndex = 26;
  for (let i = 0; i < 360; i += 360 / divider) {
    arr.push({
      title: text[realIndex] || '',
      coords: getXY(473, i - angel, 500),
      angle: i,
    });
    realIndex--;
  }
};

export const populateWeeksLower = (
  arr,
  divider: number,
  angel: number,
  text: string[]
) => {
  let realIndex = 26;
  for (let i = 0; i < 360; i += 360 / divider) {
    arr.push({
      title: text[realIndex] || '',
      coords: getXY(482, i - angel, 500),
      angle: i,
    });
    realIndex--;
  }
};

export const populateCategoryUpper = (
  arr,
  divider: number,
  angel: number,
  radius: number,
  text: string
) => {
  for (let i = 0; i < 360; i += 360 / divider) {
    arr.push({
      title: i >= 90 && i <= 270 ? text : '',
      coords: getXY(radius, i - angel, 500),
      angle: i,
    });
  }
};
export const populateCategoryLower = (
  arr,
  divider: number,
  angel: number,
  radius: number,
  text: string
) => {
  for (let i = 0; i < 360; i += 360 / divider) {
    arr.push({
      title: i >= 90 && i <= 270 ? text : '',
      coords: getXY(radius, i - angel, 500),
      angle: i,
    });
  }
};
