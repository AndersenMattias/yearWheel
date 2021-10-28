import { Arc } from './interfaces/IDonut';
import { getDegreeFromDay } from './DonutHandler';

export const wheelData = [
  {
    innerRadius: 499,
    outerRadius: 500,
    startAngle: 0 * (Math.PI / 180),
    endAngle: 360 * (Math.PI / 180),
    color: '#000',
    arcSvg: undefined,
    category: '',
  },
  {
    innerRadius: 485,
    outerRadius: 486,
    startAngle: getDegreeFromDay(0) * (Math.PI / 180),
    endAngle: getDegreeFromDay(360) * (Math.PI / 180),
    color: '#000',
    arcSvg: undefined,
    category: '',
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
    'September', ];

    export const strokeArr = [
        'Januari',
        'Februari',
        'Mars', 
        'Oktober',
        'November',
        'December',
        'April',
        'Maj',
        'Juni',
        'Juli',
        'Augusti',
        'September',
    ]


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
        '30-5'
      ];
      
