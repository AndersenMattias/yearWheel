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
  addToList,
} from './DonutHandler';

import { IDonutWheelProps, IListEvent, IListObj } from './interfaces/IDonut';

import { DonutModal } from './DonutModal';

import { sp } from '@pnp/sp';
import { IItemAddResult } from '@pnp/sp/items';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

const DonutWheel = ({
  collectionData,
  eventListData,
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

  // useEffect(() => {
  //   const addToList = async (
  //     title,
  //     description,
  //     category,
  //     startDate,
  //     endDate
  //   ) => {
  //     const iar: IItemAddResult = await sp.web.lists
  //       .getByTitle('EventPlanner')
  //       .items.add({
  //         Title: title.eventTitle,
  //         Description: description.eventDescription,
  //         Category: category.selectedCategory,
  //         StartDate: startDate.startDate,
  //         DueDate: endDate.endDate,
  //       });
  //     return iar;
  //   };

  // eventListData.forEach((item) => {
  //   console.log(item);
  //   let alreadyInList = items.find((x) => x.uniqueId == item.uniqueId);
  //   if (!alreadyInList) {
  //     console.log('lägger till');
  //     // addToList(item, item, item, item, item);
  //   } else {
  //     console.log('finns redan');
  //     return;
  //   }
  //   // addToList(item, item, item, item, item);
  // });
  // }, []);

  // const addEventToList = async (listItem) => {
  //   const iar: IItemAddResult = await sp.web.lists
  //     .getByTitle('EventPlanner')
  //     .items.add({
  // Title: listItem.eventTitle,
  // Description: listItem.eventDescription,
  // Category: listItem.selectedCategory,
  // StartDate: listItem.startDate,
  // DueDate: listItem.endDate,
  //     });
  //   return iar;
  // };

  eventListData.forEach((item) => {
    // console.log('item', item);
    // console.log('items', items);
    let alreadyInList = items.find((x) => x.uniqueId == item.uniqueId);
    if (!alreadyInList) {
      // addToList(item, item, item, item, item);
      console.log('lägger till');
    } else {
      console.log('finns redan');
      return;
    }
    // addToList(item, item, item, item, item);
  });

  useEffect(() => {
    console.log('eventListData', eventListData);
    if (items.length >= 1) {
      // console.log(items);
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

      //  create arc for each circle
      drawArcCircles(wheelData, svgEl);

      let mappedArcs = mappedItems.map((item) => {
        let wheel = wheelData.find((c) => c.category == item.category);

        const arc = d3.arc();
        const textArc = d3.arc();
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
          textLabel: textArc({
            innerRadius: wheel.innerRadius + 50,
            outerRadius: wheel.outerRadius - 50,
            startAngle: start,
            endAngle: end,
          }),
          // TODO: Fixa färg för event, lägger till men endast efter rerender?
          colour: wheel.eventColour,
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
              location: data.location,
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
          .style('font', "12px 'Helvetica Neue'")
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
      collectionData.forEach((data, index) => {
        if (index == 0) {
          addWheeldata(wheelData, 405, 470, data, 'Generell', '');
        } else if (index == 1) {
          addWheeldata(wheelData, 390, 317, data, 'Kategori 1', '');
        } else if (index == 2) {
          addWheeldata(wheelData, 300, 240, data, 'Kategori 2', '');
        } else if (index == 3) {
          addWheeldata(wheelData, 224, 154, data, 'Kategori 3', '');
        }
      });

      drawArcCircles(wheelData, svgEl);
    }

    // Populate array with data - months
    populateMonthLabels(monthTextUpper, 24, 180, monthsLabelUpper, 488, 11);
    populateMonthLabels(monthTextLower, 24, 0, monthsLabelLower, 497, 11);

    // Populate array with data - days
    populateDateLabels(datesUpper, 52, 0, datesLabelUpper, 473, 26);
    populateDateLabels(datesLower, 52, 180, datesLabelLower, 482, 26);

    // Category one
    populateCategoryLabels(
      cateOneUpper,
      6,
      90,
      392,
      collectionData[0].Category || 'Kategori 1'
    );
    populateCategoryLabels(
      catOneLower,
      6,
      270,
      401,
      collectionData[0].Category || 'Kategori 1'
    );

    // Category Two
    populateCategoryLabels(
      catTwoUpper,
      6,
      90,
      303,
      collectionData[1].Category || 'Kategori 2'
    );
    populateCategoryLabels(
      catTwoLower,
      6,
      270,
      312,
      collectionData[1].Category || 'Kategori 2'
    );

    // Category three
    populateCategoryLabels(
      catThreeUpper,
      6,
      90,
      225,
      collectionData[2].Category || 'Kategori 3'
    );
    populateCategoryLabels(
      catThreeLower,
      6,
      270,
      234,
      collectionData[2].Category || 'Kategori 3'
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
