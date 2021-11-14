import * as React from 'react';
import * as d3 from 'd3';
import styles from './Donut.module.scss';

import { useRef, useEffect, useState } from 'react';

import {
  datesLabelUpper,
  datesLabelLower,
  monthsLabelUpper,
  monthsLabelLower,
  donutWheelData,
  hiddenLabelArcsUpper,
} from './DonutWheelData';

import AddEventModal from './AddEventModal/AddEventModal';
import { EventModal } from './EventModal/EventModal';

import {
  drawText,
  getDayOfYear,
  dateWithoutTime,
  populateMonthLabels,
  populateDateLabels,
  createDonutCircle,
  createEventArc,
  populateArcLabels,
  drawArcLabels,
} from './DonutHandler';

import { IDonutWheelProps, IListObj } from './interfaces/IDonut';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

const DonutWheel = ({
  circelOneTitle,
  circleOneColour,
  circleOneEvCol,
  circleTwoTitle,
  circleTwoColour,
  circleTwoEvCol,
  circleThreeTitle,
  circleThreeColour,
  circleThreeEvCol,
  circleFourTitle,
  circleFourColour,
  circleFourEvCol,
}: IDonutWheelProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDiv, setShowDiv] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const [textValue, setTextValue] = useState<string>('');
  const [dateValue, setDateValue] = useState<string>('');
  const [eventData, setEventData] = useState<IListObj>({});

  const ref = useRef();
  const svgEl = d3.select(ref.current);

  let monthTextUpper = [];
  let monthTextLower = [];

  let datesUpper = [];
  let datesLower = [];

  let labelsforCircle = [];

  let circlesForDonut = [];
  let eventArcs = [];

  let lowerEventArcsOne = [];
  let lowerEventArcsTWo = [];
  let lowerEventArcsThree = [];

  useEffect(() => {
    const fetchList = async () => {
      const items: any[] = await sp.web.lists
        .getByTitle('EventPlanner')
        .items.get();

      setItems(items);
    };

    fetchList();
  }, []);

  // creates black "circles" for months and dates
  createDonutCircle(labelsforCircle, 499, 500, 499, 500, 0, 360, '#000');
  createDonutCircle(labelsforCircle, 485, 486, 485, 486, 0, 360, '#000');

  //
  const renderEventText = (
    index,
    event,
    data,
    fontSize: number,
    xVal: number,
    yval: number,
    dyVal: number,
    textAnchor: string,
    offSet: string
  ) => {
    svgEl
      .append('g')
      .attr('id', `arclabelLower${index}`)
      .append('path')
      .attr('stroke-width', '1.5px')
      .attr('stroke-linejoin', 'round')
      .attr('stroke', 'black')
      .attr('d', event.arcSvg)
      .attr('id', `arcEventElementLower${index}`)

      .attr('transform', `translate(500,500)`)
      .style('fill', event.colour);

    let text = svgEl
      .selectAll(`#arclabelLower${index}`)
      .append('g')
      .attr('id', 'textGroup')
      .append('text')

      .style('font', `${fontSize}px 'Rubik`)
      .style('fill', 'white')
      .attr('font-weight', 400)
      .attr('x', xVal)
      .attr('y', yval)
      .attr('dy', dyVal);

    text
      .append('textPath')
      .attr('startOffset', offSet)
      .attr('text-anchor', textAnchor)
      .attr('xlink:href', `#arcEventElementLower${index}`)
      .text(event.title);

    svgEl
      .selectAll(`#arclabelLower${index}`)
      .style('cursor', 'pointer')
      .on('mouseenter', (e) => {
        setTextValue(data.title);
        setDateValue(data.startDate + ' - ' + data.endDate);
        setShowDiv(true);
      })
      .on('mouseleave', (e) => {
        setShowDiv(false);
      })
      .on('click', (e) => {
        setEventData({
          ...eventData,
          Id: data.id,
          Title: data.title,
          Description: data.description,
          Category: data.category,
          StartDate: data.startDate,
          DueDate: data.endDate,
        });
        setIsModalOpen(true);
      });
  };

  useEffect(() => {
    // prevents duplicate elements on load / re render
    svgEl.selectAll('*').remove();

    labelsforCircle.forEach((circle) => {
      svgEl
        .append('g')
        .attr('id', `wheelRingLabels${circle.id}`)
        .append('path')
        .attr('d', circle.arcSvg)
        .attr('id', `wheelRingLabelsArc${circle.id}`)
        .attr('transform', 'translate(500,500)')
        .style('fill', circle.colour);
    });

    hiddenLabelArcsUpper.forEach((circle, index) => {
      let circleTitle;

      if (circle.category === 'Generell') {
        circleTitle = circleTwoTitle;
      } else if (circle.category === 'Kategori 1') {
        circleTitle = circleThreeTitle;
      } else if (circle.category === 'Kategori 2') {
        circleTitle = circleThreeTitle;
      } else if (circle.category === 'Kategori 3') {
        circleTitle = circleFourTitle;
      }

      svgEl
        .append('g')
        .attr('id', `arcLabelGroup${index}`)
        .append('path')
        .attr('d', circle.arcSvg)
        .attr('id', `labelArcElement${index}`)
        .attr('transform', 'translate(500,500)')
        .style('fill', 'none');

      let text = svgEl
        .selectAll(`#arcLabelGroup${index}`)
        .append('g')
        .attr('id', 'arcLabelText')
        .append('text')
        .style('fill', 'black')
        .attr('x', 3)
        .attr('dy', 13);

      text
        .append('textPath')
        .attr('startOffset', '22%')
        .attr('font-size', '16px')
        .attr('font-family', 'sans-serif')
        .attr('xlink:href', `#labelArcElement${index}`)
        .text(circleTitle);
    });

    donutWheelData.forEach((circle, index) => {
      let circleColour;

      if (circle.category === 'Generell') {
        circleColour = circleOneColour;
      } else if (circle.category === 'Kategori 1') {
        circleColour = circleTwoColour;
      } else if (circle.category === 'Kategori 2') {
        circleColour = circleThreeColour;
      } else if (circle.category === 'Kategori 3') {
        circleColour = circleFourColour;
      }

      svgEl
        .append('g')
        .attr('id', `wheelRing${circle.id}`)
        .append('path')
        .attr('d', circle.arcSvg)
        .attr('id', `wheelRingElement${index}`)
        .attr('transform', 'translate(500,500)')
        .style('fill', circleColour);
    });
  });

  useEffect(() => {
    if (items.length >= 1) {
      const mappedItems = items.map((item) => {
        return {
          id: item.Id,
          title: item.Title,
          startDate: dateWithoutTime(item.StartDate),
          endDate: dateWithoutTime(item.DueDate),
          description: item.Description,
          category: item.Category,
          startDay: getDayOfYear(new Date(item.StartDate)),
          endDay: getDayOfYear(new Date(item.DueDate)),
        };
      });

      mappedItems.map((item) => {
        if (item.category) {
          let wheel = donutWheelData.find((c) => c.category == item.category);
          let eventColour;

          if (wheel.category === 'Generell') {
            eventColour = circleOneEvCol;
          } else if (wheel.category === 'Kategori 1') {
            eventColour = circleTwoEvCol;
          } else if (wheel.category === 'Kategori 2') {
            eventColour = circleThreeEvCol;
          } else if (wheel.category === 'Kategori 3') {
            eventColour = circleFourEvCol;
          }

          createEventArc(
            item.startDay,
            item.endDay,
            eventArcs,
            wheel.innerRadius,
            wheel.outerRadius,
            wheel.innerRadius,
            wheel.outerRadius,
            eventColour,
            item.title,
            item.id,
            wheel.startAngle,
            wheel.endAngle
          );
        }
      });

      eventArcs.forEach((event, index) => {
        let data = mappedItems.find((d) => d.id == event.id);
        console.log('data', data);

        renderEventText(index, event, data, 20, 80, 0, 40, 'none', '0%');
        const center = (data.startDay + data.endDay) / 2;

        if (data.startDay < 90 && data.startDay > 0) {
          renderEventText(index, event, data, 20, 80, 0, 40, 'middle', '20%');
        } else if (data.startDay > 90 && data.startDay < 180) {
          renderEventText(index, event, data, 20, 80, 0, 40, 'middle', '60%');
        } else if (data.startDay > 180 && data.startDay < 270) {
          renderEventText(index, event, data, 20, 80, 0, 40, 'middle', '70%');
        } else if (data.startDay > 270) {
          renderEventText(index, event, data, 20, 200, 0, 40, 'middle', '10%');
        }
      });

      // Populate array with data - months
      populateMonthLabels(monthTextUpper, 24, 180, monthsLabelUpper, 488, 11);
      populateMonthLabels(monthTextLower, 24, 0, monthsLabelLower, 497, 11);

      // // Populate array with data - days
      populateDateLabels(datesUpper, 52, 0, datesLabelUpper, 473, 26);
      populateDateLabels(datesLower, 52, 180, datesLabelLower, 482, 26);

      populateArcLabels(
        lowerEventArcsOne,
        1,
        405,
        390,
        90,
        180,
        'Kategori 1',
        270,
        425,
        circleTwoTitle,
        '30%'
      );

      populateArcLabels(
        lowerEventArcsOne,
        1,
        405,
        390,
        180,
        270,
        'Kategori 1',
        270,
        425,
        circleTwoTitle,
        '30%'
      );

      populateArcLabels(
        lowerEventArcsTWo,
        2,
        317,
        300,
        90,
        180,
        'Kategori 2',
        270,
        425,
        circleThreeTitle,
        '20%'
      );

      populateArcLabels(
        lowerEventArcsTWo,
        1,
        317,
        300,
        180,
        270,
        'Kategori 2',
        270,
        425,
        circleThreeTitle,
        '20%'
      );
      populateArcLabels(
        lowerEventArcsThree,
        2,
        225,
        239,
        90,
        180,
        'Kategori 3',
        270,
        425,
        circleFourTitle,
        '4%'
      );

      populateArcLabels(
        lowerEventArcsThree,
        1,
        223,
        240,
        180,
        270,
        'Kategori 3',
        270,
        425,
        circleFourTitle,
        '4%'
      );

      // Month labels
      drawText(monthTextUpper, -105, 'monthUpper', svgEl);
      drawText(monthTextLower, -105, 'monthLower', svgEl);

      // Date labels
      drawText(datesUpper, 90, 'dateUpper', svgEl);
      drawText(datesLower, 90, 'dateLower', svgEl);

      // Draw arc labels lower / title for each circle
      drawArcLabels(lowerEventArcsOne, svgEl);
      drawArcLabels(lowerEventArcsTWo, svgEl);
      drawArcLabels(lowerEventArcsThree, svgEl);
    }
  }, [
    items,
    circlesForDonut,
    circelOneTitle,
    circleTwoTitle,
    circleThreeTitle,
    circleFourTitle,
  ]);

  const DivHover = (): JSX.Element => {
    return (
      <div className={styles.toggleDivContainer}>
        <h4 style={{ textAlign: 'center' }}>{textValue}</h4>
        <p>{dateValue}</p>
      </div>
    );
  };

  return (
    <>
      {/* <HandleEventModal items={items} setItems={setItems} /> */}
      <AddEventModal setItems={setItems} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {showDiv && <DivHover />}
        {isModalOpen && (
          <EventModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            items={items}
            setItems={setItems}
            eventData={eventData}
            setEventData={setEventData}
          />
        )}

        <svg viewBox='0 0 1000 1000' height='850' width='850' ref={ref}></svg>
      </div>
    </>
  );
};

export default DonutWheel;
