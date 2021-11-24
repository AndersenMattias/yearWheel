import * as d3 from 'd3';
import { v4 as uuid } from 'uuid';

const arc = d3.arc();
let id = uuid();

export const arcDatesUpper = [
  {
    arcSvg: arc({
      outerRadius: 486,
      innerRadius: 485,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    innerRadius: 486,
    outerRadius: 485,
    id: id,
    startAngle: 0,
    endAngle: 90,
  },
  {
    arcSvg: arc({
      outerRadius: 486,
      innerRadius: 485,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    outerRadius: 486,
    innerRadius: 485,
    id: id,
    startAngle: 270,
    endAngle: 360,
  },
];

export const arcCatNamesUpperOne = [
  {
    arcSvg: arc({
      outerRadius: 405,
      innerRadius: 390,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    innerRadius: 405,
    outerRadius: 390,
    category: 'Generell',
    id: id,
    startAngle: 0,
    endAngle: 90,
  },
  {
    arcSvg: arc({
      outerRadius: 405,
      innerRadius: 390,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    outerRadius: 405,
    innerRadius: 390,
    category: 'Generell',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },
];

export const arcCatNamesUpperTwo = [
  {
    arcSvg: arc({
      outerRadius: 317,
      innerRadius: 300,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    outerRadius: 300,
    innerRadius: 317,
    category: 'Kategori 1',
    id: id,
    startAngle: 0,
    endAngle: 90,
  },
  {
    arcSvg: arc({
      outerRadius: 317,
      innerRadius: 300,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    outerRadius: 300,
    innerRadius: 317,
    category: 'Kategori 1',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },
];
export const arcCatNamesUpperThree = [
  {
    arcSvg: arc({
      outerRadius: 240,
      innerRadius: 223,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    outerRadius: 240,
    innerRadius: 223,
    category: 'Kategori 3',
    id: id,
    startAngle: 0,
    endAngle: 90,
  },
  {
    arcSvg: arc({
      outerRadius: 240,
      innerRadius: 223,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    outerRadius: 240,
    innerRadius: 223,
    category: 'Kategori 3',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },

  {
    arcSvg: arc({
      outerRadius: 240,
      innerRadius: 223,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    outerRadius: 240,
    innerRadius: 223,
    category: 'Kategori 3',
    id: id,
    startAngle: 0,
    endAngle: 90,
  },
  {
    arcSvg: arc({
      outerRadius: 240,
      innerRadius: 223,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    outerRadius: 240,
    innerRadius: 223,
    category: 'Kategori 3',
    id: id,
    startAngle: 270,
    endAngle: 360,
  },
];
export const arcCatNamesLowerOne = [
  {
    arcSvg: arc({
      outerRadius: 405,
      innerRadius: 390,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 180 * (Math.PI / 180),
    }),
    innerRadius: 405,
    outerRadius: 390,
    category: 'Generell',
    id: id,
    startAngle: 270,
    endAngle: 180,
  },
  {
    arcSvg: arc({
      outerRadius: 405,
      innerRadius: 390,
      startAngle: 180 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    outerRadius: 405,
    innerRadius: 390,
    category: 'Generell',
    id: id,
    startAngle: 180,
    endAngle: 90,
  },
];

export const arcCatNamesLowerTwo = [
  {
    arcSvg: arc({
      outerRadius: 317,
      innerRadius: 300,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 180 * (Math.PI / 180),
    }),
    outerRadius: 300,
    innerRadius: 317,
    category: 'Kategori 1',
    id: id,
    startAngle: 270,
    endAngle: 180,
  },
  {
    arcSvg: arc({
      outerRadius: 317,
      innerRadius: 300,
      startAngle: 180 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    outerRadius: 300,
    innerRadius: 317,
    category: 'Kategori 1',
    id: id,
    startAngle: 180,
    endAngle: 90,
  },
];
export const arcCatNamesLowerThree = [
  {
    arcSvg: arc({
      outerRadius: 240,
      innerRadius: 223,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 180 * (Math.PI / 180),
    }),
    outerRadius: 240,
    innerRadius: 223,
    category: 'Kategori 3',
    id: id,
    startAngle: 270,
    endAngle: 180,
  },
  {
    arcSvg: arc({
      outerRadius: 240,
      innerRadius: 223,
      startAngle: 180 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    outerRadius: 240,
    innerRadius: 223,
    category: 'Kategori 3',
    id: id,
    startAngle: 180,
    endAngle: 90,
  },

  {
    arcSvg: arc({
      outerRadius: 240,
      innerRadius: 223,
      startAngle: 270 * (Math.PI / 180),
      endAngle: 180 * (Math.PI / 180),
    }),
    outerRadius: 240,
    innerRadius: 223,
    category: 'Kategori 3',
    id: id,
    startAngle: 270,
    endAngle: 180,
  },
  {
    arcSvg: arc({
      outerRadius: 240,
      innerRadius: 223,
      startAngle: 180 * (Math.PI / 180),
      endAngle: 90 * (Math.PI / 180),
    }),
    outerRadius: 240,
    innerRadius: 223,
    category: 'Kategori 3',
    id: id,
    startAngle: 180,
    endAngle: 90,
  },
];

export const donutWheelData = [
  {
    arcSvg: arc({
      outerRadius: 470,
      innerRadius: 410,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    outerRadius: 470,
    innerRadius: 410,
    category: 'Generell',
    id: id,
    startAngle: 0,
    endAngle: 360,
  },

  {
    arcSvg: arc({
      outerRadius: 390,
      innerRadius: 330,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    outerRadius: 390,
    innerRadius: 330,
    category: 'Kategori 1',
    id: id,
    startAngle: 0,
    endAngle: 360,
  },
  {
    arcSvg: arc({
      outerRadius: 300,
      innerRadius: 240,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    outerRadius: 300,
    innerRadius: 240,
    category: 'Kategori 2',
    id: id,
    startAngle: 0,
    endAngle: 360,
  },
  {
    arcSvg: arc({
      outerRadius: 220,
      innerRadius: 160,
      startAngle: 0 * (Math.PI / 180),
      endAngle: 360 * (Math.PI / 180),
    }),
    outerRadius: 220,
    innerRadius: 160,
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
  '28-31',
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
