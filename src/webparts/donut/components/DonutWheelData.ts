import * as d3 from 'd3';
import { v4 as uuid } from 'uuid';

const arc = d3.arc();
let id = uuid();

export const hiddenLabelArcsUpper = [
  {
    arcSvg: arc({
      innerRadius: 405,
      outerRadius: 390,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    innerRadius: 404,
    outerRadius: 389,
    category: 'Generell',
    id: id,
    startAngle: 0,
    endAngle: 90,
  },
  {
    arcSvg: arc({
      innerRadius: 405,
      outerRadius: 390,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 404,
    outerRadius: 389,
    category: 'Generell',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },
  {
    arcSvg: arc({
      innerRadius: 317,
      outerRadius: 300,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    innerRadius: 316,
    outerRadius: 301,
    category: 'Kategori 1',
    id: id,
    startAngle: 0,
    endAngle: 90,
  },
  {
    arcSvg: arc({
      innerRadius: 317,
      outerRadius: 300,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 316,
    outerRadius: 301,
    category: 'Kategori 1',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },

  {
    arcSvg: arc({
      innerRadius: 317,
      outerRadius: 300,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    innerRadius: 316,
    outerRadius: 301,
    category: 'Kategori 2',
    id: id,
    startAngle: 0,
    endAngle: 90,
  },

  {
    arcSvg: arc({
      innerRadius: 317,
      outerRadius: 300,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 316,
    outerRadius: 301,
    category: 'Kategori 2',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },

  {
    arcSvg: arc({
      innerRadius: 223,
      outerRadius: 240,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    innerRadius: 153,
    outerRadius: 389,
    category: 'Kategori 3',
    id: id,
    startAngle: 0,
    endAngle: 90,
  },
  {
    arcSvg: arc({
      innerRadius: 223,
      outerRadius: 240,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 153,
    outerRadius: 389,
    category: 'Kategori 3',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },
];

export const hiddenLabelArcsLowerOne = [
  {
    arcSvg: arc({
      innerRadius: 405,
      outerRadius: 390,
      startAngle: 180 * (Math.PI / 180),
      endAngle: 270 * (Math.PI / 180),
    }),
    innerRadius: 404,
    outerRadius: 389,
    category: 'Generell',
    id: id,
    startAngle: 180,
    endAngle: 270,
  },
  {
    arcSvg: arc({
      innerRadius: 405,
      outerRadius: 390,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 404,
    outerRadius: 389,
    category: 'Generell',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },
];

export const hiddenLabelArcsLowerTwo = [
  {
    arcSvg: arc({
      innerRadius: 317,
      outerRadius: 300,
      startAngle: 180 * (Math.PI / 180),
      endAngle: 270 * (Math.PI / 180),
    }),
    innerRadius: 316,
    outerRadius: 301,
    category: 'Kategori 1',
    id: id,
    startAngle: 180,
    endAngle: 270,
  },
  {
    arcSvg: arc({
      innerRadius: 317,
      outerRadius: 300,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 316,
    outerRadius: 301,
    category: 'Kategori 1',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },
];

export const hiddenLabelArcsLowerThree = [
  {
    arcSvg: arc({
      innerRadius: 317,
      outerRadius: 300,
      startAngle: 90 * (Math.PI / 180),
      endAngle: 180 * (Math.PI / 180),
    }),
    innerRadius: 316,
    outerRadius: 301,
    category: 'Kategori 2',
    id: id,
    startAngle: 90,
    endAngle: 180,
  },
  {
    arcSvg: arc({
      innerRadius: 317,
      outerRadius: 300,
      startAngle: 180 * (Math.PI / 180),
      endAngle: 270 * (Math.PI / 180),
    }),
    innerRadius: 316,
    outerRadius: 301,
    category: 'Kategori 2',
    id: id,
    startAngle: 180,
    endAngle: 270,
  },
];

export const hiddenLabelArcsLowerFour = [
  {
    arcSvg: arc({
      innerRadius: 223,
      outerRadius: 240,
      startAngle: 180 * (Math.PI / 180),
      endAngle: 270 * (Math.PI / 180),
    }),
    innerRadius: 153,
    outerRadius: 389,
    category: 'Kategori 3',
    id: id,
    startAngle: 180,
    endAngle: 270,
  },
  {
    arcSvg: arc({
      innerRadius: 223,
      outerRadius: 240,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 153,
    outerRadius: 389,
    category: 'Kategori 3',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },
];

export const donutWheelData = [
  {
    arcSvg: arc({
      innerRadius: 405,
      outerRadius: 470,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 405,
    outerRadius: 470,
    category: 'Generell',
    id: id,
    startAngle: 0,
    endAngle: 360,
  },
  {
    arcSvg: arc({
      innerRadius: 390,
      outerRadius: 317,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 390,
    outerRadius: 317,
    category: 'Kategori 1',
    id: id,
    startAngle: 0,
    endAngle: 360,
  },
  {
    arcSvg: arc({
      innerRadius: 300,
      outerRadius: 240,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 300,
    outerRadius: 240,
    category: 'Kategori 2',
    id: id,
    startAngle: 0,
    endAngle: 360,
  },
  {
    arcSvg: arc({
      innerRadius: 224,
      outerRadius: 154,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    innerRadius: 224,
    outerRadius: 154,
    category: 'Kategori 3',
    id: id,
    startAngle: 0,
    endAngle: 360,
  },
];

export const monthsLabelUpper = [
  'Oktober',
  'November',
  'December',
  'Januari',
  'Februari',
  'Mars',
];

export const monthsLabelLower = [
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Augusti',
  'September',
];

export const datesLabelUpper = [
  '5-11',
  '12-18',
  '19-25',
  '26-1',
  '2-8',
  '9-15',
  '16-22',
  '23-29',
  '30-6',
  '7-13',
  '14-20',
  '21-27',
  '8-31',
  '1-5',
  '6-12',
  '13-19',
  '20-26',
  '27-2',
  '3-9',
  '10-16',
  '17-23',
  '24-1',
  '2-8',
  '9-15',
  '16-22',
  '23-29',
];

export const datesLabelLower = [
  '21-27',
  '14-20',
  '7-13',
  '31-6',
  '24-30',
  '17-23',
  '10-16',
  '3-9',
  '27-2',
  '20-26',
  '13-19',
  '6-12',
  '29-5',
  '22-28',
  '15-21',
  '8-14',
  '1-7',
  '25-31',
  '18-24',
  '11-17',
  '4-10',
  '27-3',
  '20-26',
  '13-19',
  '6-12',
  '30-5',
];
