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
} from './DonutWheelData';

import {
  drawText,
  getDayOfYear,
  getCentroid,
  getDegreeFromDay,
  dateWithoutTime,
  populateMonthLabels,
  populateDateLabels,
  createDonutCircle,
} from './DonutHandler';

import { IDonutWheelProps, IListObj } from './interfaces/IDonut';

import { DonutModal } from './DonutModal';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import AddEventModal from './AddEventModal/AddEventModal';
import HandleEventModal from './HandleEventModal/HandleEventModal';

const DonutWheel = ({
  collectionData,
  selectedCategory,
  circelOneTitle,
  circleOneColour,
  circleOneEvCol,
  circleTwoTitle,
  circleTwoColour,
  circleTwoEvCol,
  circleThreeTitle,
  circleThreeColour,
  circleThreeEvCol,
  circelFourTitle,
  circleFourColour,
  circleFourEvCol,
}: IDonutWheelProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDiv, setShowDiv] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const [textValue, setTextValue] = useState<string>('');
  const [dateValue, setDateValue] = useState<string>('');
  const [dataObj, setDataObj] = useState<IListObj>({});

  const ref = useRef();
  const svgEl = d3.select(ref.current);

  let monthTextUpper = [];
  let monthTextLower = [];

  let datesUpper = [];
  let datesLower = [];

  let labelsforCircle = [];
  let circlesForDonut = [];

  useEffect(() => {
    const fetchList = async () => {
      const items: any[] = await sp.web.lists
        .getByTitle('EventPlanner')
        .items.get();

      setItems(items);
    };

    fetchList();
  }, []);

  useEffect(() => {
    // prevents duplicate elements onload / rerender
    svgEl.selectAll('*').remove();

    // creates black "circles" for months and dates
    createDonutCircle(labelsforCircle, 499, 500, 499, 500, 0, 360, '#000');
    createDonutCircle(labelsforCircle, 485, 486, 485, 486, 0, 360, '#000');

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

    donutWheelData.forEach((circle, index) => {
      let circleColour;
      let circleTitle;

      if (circle.category === 'Generell') {
        circleColour = circleOneColour;
        circleTitle = circelOneTitle;
      } else if (circle.category === 'Kategori 1') {
        circleColour = circleTwoColour;
        circleTitle = circleTwoTitle;
      } else if (circle.category === 'Kategori 2') {
        circleColour = circleThreeColour;
        circleTitle = circleThreeTitle;
      } else if (circle.category === 'Kategori 3') {
        circleColour = circleFourColour;
        circleTitle = circelFourTitle;
      }

      svgEl
        .append('g')
        .attr('id', `wheelRing${circle.id}`)
        .append('path')
        .attr('d', circle.arcSvg)
        .attr('id', `wheelRingElement${index}`)
        .attr('transform', 'translate(500,500)')
        .style('fill', circleColour);

      let text = svgEl
        .selectAll(`#wheelRing${circle.id}`)
        .append('g')
        .attr('id', 'wheelRingText')
        .append('text')
        // .style('font', "14px 'Rubik")
        // .style('fill', 'black')
        // .attr('text-anchor', 'center')
        .attr('x', 10)
        .attr('dy', -2);

      text
        .append('textPath')
        .attr('startOffset', '17%')
        // .attr('font-size', '14px')
        // .style('stroke', 'white')
        // .style('stroke-width', 1)
        // .style('colour', 'black')
        .attr('font-family', 'sans-serif')
        .attr('xlink:href', `#wheelRingElement${index}`)
        .text(circleTitle);
    });
  });

  useEffect(() => {
    if (items.length >= 1) {
      const mappedItems = items.map((item, index) => {
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

      let mappedArcs = mappedItems.map((item) => {
        let wheel = donutWheelData.find((c) => c.category == item.category);
        const arc = d3.arc();
        const start = getDegreeFromDay(item.startDay) * (Math.PI / 180);
        const end = getDegreeFromDay(item.endDay) * (Math.PI / 180);

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

        return {
          arcSvg: arc({
            innerRadius: wheel.innerRadius,
            outerRadius: wheel.outerRadius,
            startAngle: start,
            endAngle: end,
          }),
          centroid: getCentroid(
            wheel.innerRadius,
            wheel.outerRadius,
            start,
            end
          ),
          colour: eventColour,
          title: item.title,
          id: item.id,
          endAngle: end,
          startAngle: start,
        };
      });

      mappedArcs.forEach((event, index) => {
        let data = mappedItems.find((d) => d.id == event.id);

        svgEl
          .append('g')
          .attr('id', `arclabel${data.id}`)
          .append('path')
          .attr('d', event.arcSvg)
          .attr('id', `arcEventElement${data.id}`)
          .attr('transform', 'translate(500,500)')
          .style('fill', event.colour);

        let text = svgEl
          .selectAll(`#arclabel${data.id}`)
          .append('g')
          .attr('id', 'textGroup')
          .append('text')
          .style('font', "16px 'Rubik")
          .style('fill', 'white')
          .attr('x', 8)
          //   .attr("dy", function(d,i) {
          //     return (d.endAngle > 90 * Math.PI/180 ? 18 : -11);
          // })
          .attr('dy', 20);

        text
          .append('textPath')
          // .attr('startOffset', '50%')
          // .style('text-anchor', 'middle')
          // .attr('font-size', '15px')
          // .style('fill', 'black')
          // .attr('font-family', 'Rubik')
          .attr('xlink:href', `#arcEventElement${data.id}`)
          .text(event.title);

        svgEl
          .selectAll(`#arclabel${data.id}`)
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
            setDataObj({
              ...dataObj,
              title: data.title,
              description: data.description,
              start: data.startDate,
              end: data.endDate,
            });
            setIsModalOpen(true);
          });
      });

      // Populate array with data - months
      populateMonthLabels(monthTextUpper, 24, 180, monthsLabelUpper, 488, 11);
      populateMonthLabels(monthTextLower, 24, 0, monthsLabelLower, 497, 11);

      // // Populate array with data - days
      populateDateLabels(datesUpper, 52, 0, datesLabelUpper, 473, 26);
      populateDateLabels(datesLower, 52, 180, datesLabelLower, 482, 26);

      // Month labels
      drawText(monthTextUpper, -105, 'monthUpper', svgEl);
      drawText(monthTextLower, -105, 'monthLower', svgEl);

      // Date labels
      drawText(datesUpper, 90, 'dateUpper', svgEl);
      drawText(datesLower, 90, 'dateLower', svgEl);
    }
  }, [
    items,
    circlesForDonut,
    circelOneTitle,
    circleTwoTitle,
    circleThreeTitle,
    circelFourTitle,
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
      <HandleEventModal items={items} setItems={setItems} />
      <AddEventModal setItems={setItems} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {showDiv && <DivHover />}
        {isModalOpen && (
          <DonutModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            items={items}
            data={dataObj}
          />
        )}
        <svg viewBox='0 0 1000 1000' height='850' width='850' ref={ref}></svg>
      </div>
    </>
  );
};

export default DonutWheel;
