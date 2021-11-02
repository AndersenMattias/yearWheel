import { IItemAddResult } from '@pnp/sp/items';
import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

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
  let newDate = new Date(date).toISOString().slice(0, 10);
  return newDate;
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
  // console.log('angle to degree:', { deltaX, deltaY, radians, degrees });
  return degrees;
};

// calculates center of "box", text in center etc
export const getCentroid = (innerRadius, outerRadius, startAngle, endAngle) => {
  const r = (+innerRadius + +outerRadius) / 2;
  const a = (+startAngle + +endAngle) / 2 - Math.PI / 2;

  return [Math.cos(a) * r, Math.sin(a) * r];
};

// add data to wheelData array
export const addWheeldata = (
  arr,
  innerradius: number,
  outerRadius: number,
  colour: any,
  category: any,
  evColour: any
) => {
  return arr.push({
    innerRadius: innerradius,
    outerRadius: outerRadius,
    startAngle: getDegreeFromDay(0) * (Math.PI / 180),
    endAngle: getDegreeFromDay(360) * (Math.PI / 180),
    colour: colour.Colour,
    arcSvg: undefined,
    category: category.pickCategory,
    eventColour: evColour.eventColour,
  });
};

export const addEvent = async (listItem) => {
  const iar: IItemAddResult = await sp.web.lists
    .getByTitle('EventPlanner')
    .items.add({
      Title: listItem.eventTitle,
      Category: listItem.selectedCategory,
      Description: listItem.eventDescription,
      StartDate: listItem.startDate,
      DueDate: listItem.endDate,
    });
  return iar;
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

export const populateMonthLabels = (
  arr,
  divider: number,
  angel: number,
  labels: string[],
  radius: number,
  countRealIndex?: number
) => {
  let index = 0;
  let realIndex = countRealIndex;
  for (let i = 0; i <= 360; i += 360 / divider) {
    index++;
    if (index % 2 == 0) {
      arr.push({
        title: labels[realIndex] || '',
        coords: getXY(radius, i - angel, 500),
        angle: i,
      });
      realIndex--;
    }
  }
};
export const populateDateLabels = (
  arr,
  divider: number,
  angel: number,
  labels: string[],
  radius: number,
  countRealIndex?: number
) => {
  let realIndex = countRealIndex;
  for (let i = 0; i < 360; i += 360 / divider) {
    arr.push({
      title: labels[realIndex] || '',
      coords: getXY(radius, i - angel, 500),
      angle: i,
    });
    realIndex--;
  }
};

export const populateCategoryLabels = (
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
