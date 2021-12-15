import * as React from 'react';
import * as d3 from 'd3';
import styles from './Donut.module.scss';

import { useRef, useEffect, useState } from 'react';

import {
  monthsLabelUpper,
  monthsLabelLower,
  donutWheelData,
  arcCatNamesUpperOne,
  arcCatNamesUpperTwo,
  arcCatNamesUpperThree,
  arcCatNamesLowerOne,
  arcCatNamesLowerTwo,
  arcCatNamesLowerThree,
  yearWheelDatesUpper,
  yearWheelDatesLowerOne,
  yearWheeldatesUpperTwo,
  yearWheelDatesLowerTwo,
} from './DonutWheelData';

import { EventModal } from './EventModal/EventModal';
import { AddEventModal } from './AddEventModal/AddEventModal';

import {
  drawText,
  getDayOfYear,
  populateMonthLabels,
  createDateCircles,
  populateArcCategories,
  renderEventText,
  onCreateEvent,
  populateDates,
} from './DonutHandler';

import { IDonutWheelProps, IListObj, IListItem } from './interfaces/IDonut';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

import { lighten } from 'polished';

import { addDays } from 'date-fns';

const DonutWheel = ({
  library,
  circelOneTitle,
  circleOneEvCol,
  circleTwoTitle,
  circleTwoEvCol,
  circleThreeTitle,
  circleThreeEvCol,
  circleFourTitle,
  circleFourEvCol,
}: IDonutWheelProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDiv, setShowDiv] = useState<boolean>(false);
  const [items, setItems] = useState<IListItem[]>([]);
  const [textValue, setTextValue] = useState<string>('');
  const [dateValue, setDateValue] = useState<string>('');
  const [eventData, setEventData] = useState<IListObj>({});

  const ref = useRef();

  let monthTextUpper = [];
  let monthTextLower = [];

  let labelsforCircle = [];

  let circlesForDonut = [];
  let eventArcs = [];

  useEffect(() => {
    const fetchList = async () => {
      const items: IListItem[] = await sp.web.lists
        .getByTitle(library)
        .items.get();

      setItems(items);
    };

    if (library !== undefined) {
      fetchList();
    }
  }, [library]);

  useEffect(() => {
    const svgEl = d3.select(ref.current);

    // prevents duplicate elements on load / re render
    svgEl.selectAll('*').remove();

    let oneJan = new Date(new Date().getFullYear(), 0, 1);

    let firstDay = 1;
    let lastDay = 8 - oneJan.getDay();
    let datesArr = [];

    // add dates for whole year, mon-sun
    while (lastDay < 365) {
      firstDay += lastDay - firstDay;
      lastDay += 7;

      datesArr
        .push(
          addDays(oneJan, firstDay).getDate() +
            '-' +
            addDays(oneJan, lastDay - 1).getDate()
        )
        .toString();
    }

    // create black "circle" for months

    createDateCircles(labelsforCircle, 499, 500, 499, 500, 0, 360, '#000');
    // createDateCircles(labelsforCircle, 485, 486, 485, 486, 0, 360, '#000');

    labelsforCircle.forEach((circle, index) => {
      svgEl
        .append('g')
        .attr('id', `wheelRing-${library}-${index}`)
        .append('path')
        .attr('d', circle.arcSvg)

        .attr('transform', `translate(500,500)`)
        .style('fill', 'black');
    });

    const q1 = datesArr.slice(0, 13).toString().replace(/,/g, ' ');
    const q2 = datesArr.slice(13, 26).toString().replace(/,/g, ' ');
    const q3 = datesArr.slice(26, 39).toString().replace(/,/g, ' ');
    const q4 = datesArr.slice(39).toString().replace(/,/g, ' ');

    populateDates(
      yearWheelDatesUpper,
      svgEl,
      library,
      'datesUpperOne',
      'datesUpperOne',
      13.5,
      q1
    );
    populateDates(
      yearWheeldatesUpperTwo,
      svgEl,
      library,
      'datesUpperTwo',
      'datesUpperTwo',
      13.5,
      q4
    );
    populateDates(
      yearWheelDatesLowerOne,
      svgEl,
      library,
      'datesLowerOne',
      'datesLowerOne',
      -3,
      q3
    );
    populateDates(
      yearWheelDatesLowerTwo,
      svgEl,
      library,
      'datesLowerTwo',
      'datesLowerTwo',
      -3,
      q2
    );

    // renders upper titles for categories
    populateArcCategories(
      arcCatNamesUpperOne,
      circleTwoTitle,
      circleThreeTitle,
      circleFourTitle,
      svgEl,
      'arcLabelGroupUpperOne',
      'labelArcElementUpperOne',
      0,
      12
    );

    // renders upper titles for categories
    populateArcCategories(
      arcCatNamesUpperTwo,
      circleTwoTitle,
      circleThreeTitle,
      circleFourTitle,
      svgEl,
      'arcLabelGroupUpperTwo',
      'labelArcElementUpperTwo',
      0,
      8
    );
    populateArcCategories(
      arcCatNamesUpperThree,
      circleTwoTitle,
      circleThreeTitle,
      circleFourTitle,
      svgEl,
      'arcLabelGroupUpperThree',
      'labelArcElementUpperThree',
      0,
      16
    );

    // renders lower titles for categories
    populateArcCategories(
      arcCatNamesLowerOne,
      circleTwoTitle,
      circleThreeTitle,
      circleFourTitle,
      svgEl,
      'arcLabelGroupLowerOne',
      'labelArcElementLowerOne',
      0,
      0
    );
    // renders lower titles for categories
    populateArcCategories(
      arcCatNamesLowerTwo,
      circleTwoTitle,
      circleThreeTitle,
      circleFourTitle,
      svgEl,
      'arcLabelGroupLowerTwo',
      'labelArcElementLowerTwo',
      0,
      6
    );
    populateArcCategories(
      arcCatNamesLowerThree,
      circleTwoTitle,
      circleThreeTitle,
      circleFourTitle,
      svgEl,
      'arcLabelGroupLowerThree',
      'labelArcElementLowerThree',
      0,
      -4
    );

    donutWheelData.forEach((circle, index) => {
      let circleColour;

      if (circle.category === 'Generell') {
        circleColour = lighten(0.2, circleOneEvCol ?? '#0585fc');
      } else if (circle.category == 'Kategori 1') {
        circleColour = lighten(0.2, circleTwoEvCol ?? '#0585fc');
      } else if (circle.category == 'Kategori 2') {
        circleColour = lighten(0.2, circleThreeEvCol ?? '#0585fc');
      } else if (circle.category == 'Kategori 3') {
        circleColour = lighten(0.2, circleFourEvCol ?? '#0585fc');
      }

      svgEl
        .append('g')
        .attr('id', `wheelRing${library}${circle.id}`)
        .append('path')
        .attr('d', circle.arcSvg)
        .attr('id', `wheelRingElement${library}${index}`)
        .attr('transform', 'translate(500,500)')
        .style('fill', circleColour);
    });

    // Populate array with data - months
    populateMonthLabels(monthTextUpper, 24, 180, monthsLabelUpper, 488, 11);
    populateMonthLabels(monthTextLower, 24, 0, monthsLabelLower, 497, 11);

    // Month labels
    drawText(monthTextUpper, -105, 'monthUpper', svgEl);
    drawText(monthTextLower, -105, 'monthLower', svgEl);
  }, [labelsforCircle]);

  useEffect(() => {
    const svgEl = d3.select(ref.current);
    let currentYear = new Date().getFullYear();
    if (items.length >= 1) {
      let mappedItems: IListItem[] = [];
      items.forEach((item, index) => {
        let startDate = new Date(item.StartDate);
        let dueDate = new Date(item.EndDate);
        let counter = 0;
        if (
          startDate.getFullYear() == currentYear &&
          dueDate.getFullYear() == currentYear &&
          item.StartDate < item.EndDate
        )
          // if (counter < 2) {
          mappedItems.push({
            Id: item.Id,
            Title: item.Title,
            StartDate: new Date(item.StartDate),
            EndDate: new Date(item.EndDate),
            Description: item.Description,
            Category: item.Category,
            StartDay: getDayOfYear(startDate),
            EndDay: getDayOfYear(dueDate),
          });
        // }
      });

      onCreateEvent(
        mappedItems,
        mappedItems,
        circleOneEvCol,
        circleTwoEvCol,
        circleThreeEvCol,
        circleFourEvCol,
        eventArcs
      );

      eventArcs.forEach((event, index) => {
        let data = mappedItems.find((d) => d.Id == event.id);

        if (data.StartDay < 90 && data.StartDay > 0) {
          renderEventText(svgEl, library, index, event, data, 5, 20);
        } else if (data.StartDay > 90 && data.StartDay < 180) {
          renderEventText(svgEl, library, index, event, data, 5, -10);
        } else if (data.StartDay > 180 && data.StartDay < 270) {
          renderEventText(svgEl, library, index, event, data, 5, -5);
        } else if (data.StartDay > 270 && data.StartDay < 365) {
          renderEventText(svgEl, library, index, event, data, 5, 20);
        }

        svgEl
          .selectAll(`#arcLabel-${library}-${data.Id}`)
          .style('cursor', 'pointer')
          .on('mouseenter', (e) => {
            setTextValue(data.Title);
            setDateValue(
              data.StartDate.toLocaleDateString('sv-SE') +
                ' - ' +
                data.EndDate.toLocaleDateString('sv-SE')
            );
            setShowDiv(true);
          })
          .on('mouseleave', (e) => {
            setShowDiv(false);
          })
          .on('click', (e) => {
            setShowDiv(false);
            setEventData({
              ...eventData,
              Id: data.Id,
              Title: data.Title,
              Description: data.Description,
              Category: data.Category,
              StartDate: data.StartDate.toLocaleDateString('sv-SE'),
              EndDate: data.EndDate.toLocaleDateString('sv-SE'),
            });
            setIsModalOpen(true);
          });
      });
    }
  }, [
    items,
    circlesForDonut,
    circleOneEvCol,
    circleTwoEvCol,
    circleThreeEvCol,
    circleFourEvCol,
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
      <AddEventModal items={items} setItems={setItems} library={library} />
      <div className={styles.yearWheelContainer}>
        {showDiv && <DivHover />}
        {isModalOpen && (
          <EventModal
            library={library}
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
