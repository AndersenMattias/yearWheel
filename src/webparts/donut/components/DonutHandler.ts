import { IItemAddResult } from '@pnp/sp/items';
import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import * as d3 from 'd3';
import { v4 as uuid } from 'uuid';

const arc = d3.arc();
let arcId = uuid();

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
  if (new Date(date).toString().indexOf('T') != -1) {
    return new Date(date).toISOString().slice(0, 10);
  } else {
    return date;
  }
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

export const createDonutCircle = (
  arr,
  innerRadius: number,
  outerRadius: number,
  arcInner: number,
  arcOuter: number,
  start: number,
  end: number,
  colour: string,
  category?: string,
  title?: string,
  evColour?: string
) => {
  const arc = d3.arc();
  let id = uuid();
  return arr.push({
    arcSvg: arc({
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      startAngle: start * (Math.PI / 180),
      endAngle: end * (Math.PI / 180),
    }),
    innerRad: arcInner,
    outerRad: arcOuter,
    category: category,
    colour: colour,
    title: title,
    eventColour: evColour,
    id: id,
  });
};
export const createEventArc = (
  startDay,
  endDay,
  arr,
  innerRadius: number,
  outerRadius: number,
  outerRad,
  innerRad,
  eventColour: string,
  title: string,
  id: number,
  arcStart,
  arcEnd
) => {
  const arc = d3.arc();
  const start = getDegreeFromDay(startDay) * (Math.PI / 180);
  const end = getDegreeFromDay(endDay) * (Math.PI / 180);
  return arr.push({
    arcSvg: arc({
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      startAngle: start,
      endAngle: end,
    }),
    centroid: getCentroid(innerRad, outerRad, start, end),
    colour: eventColour,
    title: title,
    id: id,
    startAngle: arcStart,
    endAngle: arcEnd,
  });
};

export const addWheeldata = (
  arr,
  innerradius: number,
  outerRadius: number,
  colour: string,
  category: string,
  evColour: string
) => {
  return arr.push({
    innerRadius: innerradius,
    outerRadius: outerRadius,
    startAngle: getDegreeFromDay(0) * (Math.PI / 180),
    endAngle: getDegreeFromDay(360) * (Math.PI / 180),
    colour: colour,
    arcSvg: undefined,
    category: category,
    eventColour: evColour,
  });
};

export const addToList = async (
  title: string,
  description: string,
  category: string,
  startDate: string,
  endDate: string
) => {
  const iar: IItemAddResult = await sp.web.lists
    .getByTitle('EventPlanner')
    .items.add({
      Title: title,
      Description: description,
      Category: category,
      StartDate: startDate,
      DueDate: endDate,
    });

  return iar;
};

export const onUpdateEvent = async (
  id: number,
  title: string,
  description: string,
  category: string,
  startDate,
  dueDate
) => {
  let list = sp.web.lists.getByTitle('EventPlanner');
  const updateEvent = await list.items.getById(id).update({
    Title: title,
    Description: description,
    Category: category,
    StartDate: startDate,
    DueDate: dueDate,
  });
  return updateEvent;
};

export const onDeleteEvent = async (id: number) => {
  let list = sp.web.lists.getByTitle('EventPlanner');
  const deleteEvent = await list.items.getById(id).delete();
  return deleteEvent;
};

export const drawArcCircles = (arr, svg) => {
  let wheelBase = arr.map((base) => {
    const arc = d3.arc();
    return {
      arcSvg: arc({
        innerRadius: base.innerRadius,
        outerRadius: base.outerRadius,
        startAngle: base.startAngle,
        endAngle: base.endAngle,
      }),
      colour: base.colour,
      category: base.category,
    };
  });

  wheelBase.forEach((base) =>
    svg
      .append('path')
      .attr('d', base.arcSvg)
      .style('fill', base.colour)
      .attr('transform', 'translate(500,500)')
  );
};

export const drawText = (arr: any[], rotate: number, name: string, svgEl) => {
  arr.forEach((coord, index) => {
    svgEl
      .append('g')
      .attr('class', name)
      .append('g')
      .append('text')
      .attr('x', coord.coords.x)
      .attr('y', coord.coords.y)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
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

// create label on each arc
export const drawArcLabels = (arr: any[], svgEl) => {
  arr.forEach((label, index) => {
    svgEl
      .append('g')
      .attr('id', `arcLabelGroupLower${label.id}`)
      .append('path')
      .attr('d', label.arcSvg)
      .attr('id', `labelArcElementLower${label.id}`)
      .attr('transform', 'translate(500,500)')
      .style('fill', 'none');

    let text = svgEl
      .selectAll(`#arcLabelGroupLower${label.id}`)
      .append('g')
      .attr('id', 'arcLabelText')
      .append('text')
      .attr('x', label.coords.x)
      .attr('y', label.coords.y)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-family', 'sans-serif')
      // .text(circleTitle)
      // .attr(
      //   'transform',
      //   `rotate(${rotate + (360 / arr.length) * (arr.length - index)}, ${
      //     label.coords.x
      //   }, ${label.coords.y})`
      // );
      .attr('dy', 12);

    text
      .append('textPath')
      .attr('startOffset', label.offSet)
      .attr('font-size', '16px')
      // .style('stroke', 'white')
      // .style('stroke-width', 1)
      .attr('font-family', 'sans-serif')
      .attr('xlink:href', `#labelArcElementLower${label.id}`)
      .text(label.title);
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

export const populateArcLabels = (
  arr,
  divider: number,
  innerRadius: number,
  outerRadius: number,
  start: number,
  end: number,
  category: string,
  angel: number,
  radius: number,
  title: string,
  offSet
) => {
  for (let i = 0; i < 360; i += 360 / divider) {
    const arc = d3.arc();
    let id = uuid();
    arr.push({
      arcSvg: arc({
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        startAngle: start * (Math.PI / 180),
        endAngle: end * (Math.PI / 180),
      }),
      category: category,
      title: title,
      id: id,
      // title: i >= 90 && i <= 270 ? text : '',
      angle: i,
      coords: getXY(radius, i - angel, 500),
      offSet: offSet,
    });
  }
};
