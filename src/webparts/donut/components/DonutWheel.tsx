import * as React from 'react';
import * as d3 from 'd3';
import styles from './Donut.module.scss';

import { useRef, useEffect, useState } from 'react';

import {
  datesLabelUpper,
  datesLabelLower,
  monthsLabelUpper,
  monthsLabelLower,
  strokeArr,
  wheelData,
  wheelEventData,
} from './DonutWheelData';

import {
  addWheeldata,
  drawText,
  getDayOfYear,
  getCentroid,
  getDegreeFromDay,
  populateCategoryLower,
  populateCategoryUpper,
  populateMonthsArrLower,
  populateMonthsArrUpper,
  populateWeeksLower,
  populateWeeksUpper,
  dateWithoutTime,
} from './DonutHandler';

import { Arc, IDonutWheelProps, IListObj } from './interfaces/IDonut';

import { DonutModal } from './DonutModal';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

const DonutWheel = ({ collectionData }: IDonutWheelProps): JSX.Element => {
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

      // loop over data from input in "collectionpanel"
      // create one circle for each category
      collectionData.forEach((data, index) => {
        if (index == 0) {
          addWheeldata(wheelData, 405, 470, data, data, data);
        } else if (index == 1) {
          addWheeldata(wheelData, 390, 317, data, data, data);
        } else if (index == 2) {
          addWheeldata(wheelData, 300, 240, data, data, data);
        } else if (index == 3) {
          addWheeldata(wheelData, 224, 154, data, data, data);
        }
      });

      let wheelBase = wheelData.map((base) => {
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
        svgEl
          .append('path')
          .attr('d', base.arcSvg)
          .style('fill', base.colour)
          .attr('transform', 'translate(500,500)')
      );

      let mappedArcs = mappedItems.map((item) => {
        let wheel = wheelData.find((c) => c.category == item.category);

        const arc = d3.arc();
        const start = getDegreeFromDay(item.startDay) * (Math.PI / 180);
        const end = getDegreeFromDay(item.endDay) * (Math.PI / 180);

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
          // TODO: Fixa färg för event, lägger till men endast efter rerender?
          colour: wheel.eventColour,
          title: item.title,
          id: item.id,
        };
      });

      mappedArcs.forEach((event) => {
        let data = mappedItems.find((d) => d.id == event.id);

        svgEl
          .append('g')
          .append('path')
          .attr('d', event.arcSvg)
          .attr('transform', 'translate(500,500)')
          .style('fill', event.colour)

          .on('mouseenter', (e) => {
            setTextValue(event.title);
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
              location: data.location,
            });
            setIsModalOpen(true);
          });

        // svgEl
        //   .append('g')
        //   .append('text')
        // .attr('x', event.centroid[0])
        // .attr('y', event.centroid[1])
        //   .attr('transform', 'translate(500,500)')

        //   .text('We go up, then we go down, then up again.')

        svgEl.selectAll('g').style('cursor', 'pointer');

        svgEl

          .append('foreignObject')

          .attr('transform', 'translate(500,500)')
          .attr('x', event.centroid[0])
          .attr('y', event.centroid[1])
          .attr('width', 80)
          .attr('height', 80)
          .append('xhtml:div')
          .style('font', "12px 'Helvetica Neue'")
          .html(`<h3>${event.title}</h3>`)

          // .append('text')
          // .attr('font-size', '13px')
          // .attr('font-family', 'sans-serif')
          // .attr('fill', 'black')
          // .text(event.title || 'fel')

          .attr('transform', 'translate(500,500)')

          .on('click', (e) => {
            setDataObj({
              ...dataObj,
              title: data.title,
              description: data.description,
              start: data.startDate,
              end: data.endDate,
              location: data.location,
            });
            setIsModalOpen(true);
          })
          .on('mouseenter', (e) => {
            setTextValue(event.title);
            setDateValue(data.startDate + ' - ' + data.endDate);
            setShowDiv(true);
          })
          .on('mouseleave', (e) => {
            setShowDiv(false);
          });
      });
    }

    // Populate array with data - months
    populateMonthsArrUpper(monthTextUpper, 24, 180, monthsLabelUpper);
    populateMonthsArrLower(monthTextLower, 24, 0, monthsLabelLower);

    // Populate array with data - days
    populateWeeksUpper(datesUpper, 52, 0, datesLabelUpper);
    populateWeeksLower(datesLower, 52, 180, datesLabelLower);

    // Category one
    populateCategoryUpper(cateOneUpper, 6, 90, 392, collectionData[0].Category);
    populateCategoryLower(catOneLower, 6, 270, 401, collectionData[0].Category);

    // Category Two
    populateCategoryUpper(catTwoUpper, 6, 90, 303, collectionData[1].Category);
    populateCategoryLower(catTwoLower, 6, 270, 312, collectionData[1].Category);

    // Category three
    populateCategoryUpper(
      catThreeUpper,
      6,
      90,
      225,
      collectionData[2].Category
    );
    populateCategoryLower(
      catThreeLower,
      6,
      270,
      234,
      collectionData[2].Category
    );

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
  );
};

export default DonutWheel;
