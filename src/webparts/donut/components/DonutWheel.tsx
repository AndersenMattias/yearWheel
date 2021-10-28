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

import { Arc, IListObj } from './interfaces/IDonut';

import { DonutModal } from './DonutModal';
import { addDays } from '@fluentui/react';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

const DonutWheel = ({ props }): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDiv, setShowDiv] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const [eventList, setEventList] = useState<any>([]);
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
    console.log(eventList);
    let wheelData: Arc[] = [
      {
        innerRadius: 350,
        outerRadius: 349,
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

    if (items.length >= 1) {
      const mappedItems = items.map((item) => {
        console.log(items);
        return {
          id: item.Id,
          title: item.Title,
          startDate: dateWithoutTime(item.StartDate),
          endDate: dateWithoutTime(item.DueDate),
          description: item.Description,
          duration: item.Duration,
          location: item.Location,
          category: item.Category,
          startDay: getDayOfYear(new Date(item.StartDate)),
          endDay: getDayOfYear(new Date(item.DueDate)),
        };
      });

      props.collectionData.forEach((data, index) => {
        console.log('data', data);
        if (index == 0) {
          wheelData.push({
            innerRadius: 405,
            outerRadius: 470,
            startAngle: getDegreeFromDay(0) * (Math.PI / 180),
            endAngle: getDegreeFromDay(360) * (Math.PI / 180),
            color: data.Colour,
            arcSvg: undefined,
            category: data.pickCategory,
          });
        } else if (index == 1) {
          wheelData.push({
            innerRadius: 390,
            outerRadius: 317,
            startAngle: getDegreeFromDay(0) * (Math.PI / 180),
            endAngle: getDegreeFromDay(360) * (Math.PI / 180),
            color: data.Colour,
            arcSvg: undefined,
            category: data.pickCategory,
          });
        } else if (index == 2) {
          wheelData.push({
            innerRadius: 300,
            outerRadius: 240,
            startAngle: getDegreeFromDay(0) * (Math.PI / 180),
            endAngle: getDegreeFromDay(360) * (Math.PI / 180),
            color: data.Colour,
            arcSvg: undefined,
            category: data.pickCategory,
          });
        } else if (index == 3) {
          wheelData.push({
            innerRadius: 224,
            outerRadius: 154,
            startAngle: getDegreeFromDay(0) * (Math.PI / 180),
            endAngle: getDegreeFromDay(360) * (Math.PI / 180),
            color: data.Colour,
            arcSvg: undefined,
            category: data.pickCategory,
          });
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
          color: base.color,
          category: base.category,
        };
      });

      wheelBase.forEach((base) =>
        svgEl
          .append('path')
          .attr('d', base.arcSvg)
          .style('fill', base.color)
          .attr('transform', 'translate(500,500)')
      );

      let mappedArcs = mappedItems.map((item) => {
        console.log('item', item);
        const arc = d3.arc();
        const start = getDegreeFromDay(item.startDay) * (Math.PI / 180);
        const end = getDegreeFromDay(item.endDay) * (Math.PI / 180);

        let wheel = wheelData.find((c) => c.category == item.category);

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
          color: 'pink',
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
          .style('fill', event.color)
          .attr('transform', 'translate(500,500)')
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

        svgEl
          .selectAll('g')
          .style('cursor', 'pointer')
          .append('text')
          .attr('font-size', '13px')
          .attr('font-family', 'sans-serif')
          .attr('text-anchor', 'middle')
          .attr('fill', 'black')
          .text(event.title || 'hejhej')
          .attr('x', event.centroid[0])
          .attr('y', event.centroid[1])
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
    populateCategoryUpper(
      cateOneUpper,
      6,
      90,
      392,
      props.collectionData[0].Category
    );
    populateCategoryLower(
      catOneLower,
      6,
      270,
      401,
      props.collectionData[0].Category
    );

    // Category Two
    populateCategoryUpper(
      catTwoUpper,
      6,
      90,
      303,
      props.collectionData[1].Category
    );
    populateCategoryLower(
      catTwoLower,
      6,
      270,
      312,
      props.collectionData[1].Category
    );

    // Category three
    populateCategoryUpper(
      catThreeUpper,
      6,
      90,
      225,
      props.collectionData[2].Category
    );
    populateCategoryLower(
      catThreeLower,
      6,
      270,
      234,
      props.collectionData[2].Category
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

  let length = d3.scaleLinear().range([0, 1000]);

  let rotationDegree = d3
    .scalePoint<any>()
    .domain(d3.range(13))
    .range([0, 2 * Math.PI]);

  // Replace with list content
  const futureDate = addDays(new Date(Date.now()), 20);

  // Create "pie-lines"
  // svgEl
  //   .selectAll(null)
  //   .data((d: any, i) => {
  //     return strokeArr;
  //   })
  //   .enter()
  //   .append('line')
  //   .attr('x1', 500)
  //   .attr('y1', 500)
  //   .attr('x2', (d: any, i: any) => {
  //     return length(i + 100) * Math.cos(rotationDegree(i));
  //   })
  //   .attr('y2', (d: any, i: any) => {
  //     return length(i + 100) * Math.sin(rotationDegree(i));
  //   })
  //   .style('stroke', (d) => {
  //     return '#003366';
  //   })
  //   .style('stroke-width', 0.5);

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
