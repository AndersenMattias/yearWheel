import * as React from 'react';
import * as d3 from 'd3';
import styles from './Donut.module.scss';

import { useRef, useEffect, useState } from 'react';

import {
  datesLabelUpper,
  datesLabelLower,
  monthsLabelUpper,
  monthsLabelLower,
  wheelData,
} from './DonutWheelData';

import {
  addWheeldata,
  drawText,
  getDayOfYear,
  getCentroid,
  getDegreeFromDay,
  dateWithoutTime,
  populateMonthLabels,
  populateDateLabels,
  populateCategoryLabels,
  drawArcCircles,
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

  let cateOneUpper = [];
  let catOneLower = [];
  let catTwoUpper = [];
  let catTwoLower = [];
  let catThreeUpper = [];
  let catThreeLower = [];

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

      addWheeldata(
        wheelData,
        405,
        470,
        circleOneColour,
        'Generell',
        circleOneEvCol
      );
      addWheeldata(
        wheelData,
        390,
        317,
        circleTwoColour,
        'Kategori 1',
        circleTwoEvCol
      );
      addWheeldata(
        wheelData,
        300,
        240,
        circleThreeColour,
        'Kategori 2',
        circleThreeEvCol
      );
      addWheeldata(
        wheelData,
        224,
        154,
        circleFourColour,
        'Kategori 3',
        circleFourEvCol
      );

      //  create arc for each circle
      drawArcCircles(wheelData, svgEl);

      let mappedArcs = mappedItems.map((item) => {
        let wheel = wheelData.find((c) => c.category == item.category);

        const arc = d3.arc();
        const textArc = d3.arc();
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
          textLabel: textArc({
            innerRadius: wheel.innerRadius + 50,
            outerRadius: wheel.outerRadius - 50,
            startAngle: start,
            endAngle: end,
          }),

          colour: eventColour,
          title: item.title,
          id: item.id,
        };
      });

      mappedArcs.forEach((event) => {
        let data = mappedItems.find((d) => d.id == event.id);

        let pathGroup = svgEl
          .append('g')
          .attr('id', 'pathGroup')
          .append('path')
          .attr('id', (i) => {
            return '#arc-label' + event.id;
          })
          .attr('d', event.arcSvg)
          .style('fill', event.colour)
          .attr('transform', 'translate(500,500)');

        pathGroup
          .style('cursor', 'pointer')
          .on('mouseover', (e) => {
            setTextValue(event.title);
            setDateValue(data.startDate + ' - ' + data.endDate);
            setShowDiv(true);
          })
          .on('mouseout', (e) => {
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

        svgEl
          .selectAll('g')
          // .attr('id', 'textGroup')
          .append('g')
          .append('text')
          .attr('x', event.centroid[0])
          .attr('y', event.centroid[1])
          .style('text-anchor', 'middle')
          .style('font', "14px 'Helvetica Neue'")
          .style('fill', 'black')
          // .append('textPath')
          .text(event.title)
          .attr('transform', 'translate(500,500)');
        // .attr('xlink:href', (d, i, j) => {
        //   return '#arc-label' + event.id;
        // });

        // svgEl
        //   .append('foreignObject')
        //   .attr('transform', 'translate(500,500)')
        // .attr('x', event.centroid[0])
        // .attr('y', event.centroid[1])
        //   .attr('width', 80)
        //   .attr('height', 80)
        //   .append('xhtml:div')
        //   .style('height', '80px')
        //   .style('width', '80px')

        //   .style('font', "12px 'Helvetica Neue'")
        //   .html(`<h3 >${event.title}</h3>`);
      });
    } else {
      addWheeldata(wheelData, 405, 470, 'yellow', 'Generell', 'red');
      addWheeldata(wheelData, 390, 317, 'yellow', 'Kategori 1', 'red');
      addWheeldata(wheelData, 300, 240, 'yellow', 'Kategori 2', 'red');
      addWheeldata(wheelData, 224, 154, 'yellow', 'Kategori 3', 'red');

      drawArcCircles(wheelData, svgEl);
    }

    // Populate array with data - months
    populateMonthLabels(monthTextUpper, 24, 180, monthsLabelUpper, 488, 11);
    populateMonthLabels(monthTextLower, 24, 0, monthsLabelLower, 497, 11);

    // Populate array with data - days
    populateDateLabels(datesUpper, 52, 0, datesLabelUpper, 473, 26);
    populateDateLabels(datesLower, 52, 180, datesLabelLower, 482, 26);

    // Category one
    populateCategoryLabels(cateOneUpper, 6, 90, 392, circleTwoTitle);
    populateCategoryLabels(catOneLower, 6, 270, 401, circleTwoTitle);

    // Category Two
    populateCategoryLabels(catTwoUpper, 6, 90, 303, circleThreeTitle);
    populateCategoryLabels(catTwoLower, 6, 270, 312, circleThreeTitle);

    // Category three
    populateCategoryLabels(catThreeUpper, 6, 90, 225, circelFourTitle);
    populateCategoryLabels(catThreeLower, 6, 270, 234, circelFourTitle);

    // Month labels
    drawText(monthTextUpper, -105, svgEl);
    drawText(monthTextLower, -105, svgEl);

    // Date labels
    drawText(datesUpper, 90, svgEl);
    drawText(datesLower, 90, svgEl);

    // first category
    drawText(cateOneUpper, 180, svgEl);
    drawText(catOneLower, 180, svgEl);

    // second category
    drawText(catTwoUpper, 180, svgEl);
    drawText(catTwoLower, 180, svgEl);

    // third category
    drawText(catThreeUpper, 180, svgEl);
    drawText(catThreeLower, 180, svgEl);
  }, [items]);

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
