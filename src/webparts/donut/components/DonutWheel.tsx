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
  arcCatNamesUpperOne,
  arcCatNamesUpperTwo,
  arcCatNamesUpperThree,
  arcCatNamesLowerOne,
  arcCatNamesLowerTwo,
  arcCatNamesLowerThree,
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
  populateArcCategories,
  renderEventText,
} from './DonutHandler';

import { IDonutWheelProps, IListObj, IListItem } from './interfaces/IDonut';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

const DonutWheel = ({
  library,
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
  circleFourTitle,
  circleFourColour,
  circleFourEvCol,
}: IDonutWheelProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDiv, setShowDiv] = useState<boolean>(false);
  const [items, setItems] = useState<IListItem[]>([]);
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
    // prevents duplicate elements on load / re render
    svgEl.selectAll('*').remove();

    // creates black "circles" for months and dates
    createDonutCircle(labelsforCircle, 499, 500, 499, 500, 0, 360, '#000');
    createDonutCircle(labelsforCircle, 485, 486, 485, 486, 0, 360, '#000');

    labelsforCircle.forEach((circle) => {
      svgEl
        .append('g')
        .attr('id', `wheelRingLabels${library}${circle.id}`)
        .append('path')
        .attr('d', circle.arcSvg)
        .attr('id', `wheelRingLabelsArc${library}${circle.id}`)
        .attr('transform', 'translate(500,500)')
        .style('fill', circle.colour);
    });

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
        .attr('id', `wheelRing${library}${circle.id}`)
        .append('path')
        .attr('d', circle.arcSvg)
        .attr('id', `wheelRingElement${library}${index}`)
        .attr('transform', 'translate(500,500)')
        .style('fill', circleColour ? circleColour : '#edaa4c');
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
  });

  const renderEventText = (
    svgEl,
    index: number,
    event,
    data: IListItem,
    xVal: number,
    // yVal: number,
    dyVal: number
  ) => {
    svgEl
      .append('g')
      .attr('id', `arcLabel${library}${data.Id}`)
      .append('path')
      .attr('id', 'tmpArc')
      .attr('stroke-width', '0.5px')
      .attr('stroke-linejoin', 'round')
      .attr('stroke', 'black')
      .attr('d', event.arcSvg)
      .attr('id', `arcEventElement${library}${index}`)

      .attr('transform', `translate(500,500)`)
      .style('fill', event.colour ? event.colour : '#de8d1b');

    let text = svgEl
      .selectAll(`#arcLabel${library}${data.Id}`)
      .append('g')
      .attr('id', 'textGroup')
      .append('text')
      .style('font', `1.5em 'Rubik`)
      .style('fill', 'black')
      .attr('font-weight', 400)
      .attr('x', xVal)
      // .attr('y', yVal)
      .attr('dy', dyVal);

    let diff = data.EndDay - data.StartDay;

    let circumference: number = 2 * Math.PI * event.innerRadius;
    let width = (diff / 360) * circumference;
    let height = event.outerRadius - event.innerRadius;

    if (width >= 10) {
      text
        .append('textPath')
        .attr('id', `textPath${data.Id}`)
        // .attr('startOffset', offSet)
        // .attr('text-anchor', textAnchor)
        .attr('xlink:href', `#arcEventElement${library}${index}`)
        .text(data.Title);

      let textLength = text.node().getComputedTextLength();
      let numCharacters = data.Title.length;
      let charLength = textLength / numCharacters;
      let numCharactersToShow = Math.floor(width / charLength);

      let actualLength =
        numCharacters < numCharactersToShow
          ? numCharacters
          : numCharactersToShow;

      let textPath = svgEl.select(`#textPath${data.Id}`);

      if (textLength > (diff / 360) * circumference) {
        textPath.text(data.Title.substr(0, actualLength));
      }
    }
  };

  useEffect(() => {
    let currentYear = new Date().getFullYear();
    if (items.length >= 1) {
      let mappedItems: IListItem[] = [];
      items.forEach((item, index) => {
        let startDate = new Date(item.StartDate);
        let dueDate = new Date(item.DueDate);
        if (
          startDate.getFullYear() == currentYear &&
          dueDate.getFullYear() == currentYear
        )
          mappedItems.push({
            Id: item.Id,
            Title: item.Title,
            StartDate: dateWithoutTime(item.StartDate),
            EndDate: dateWithoutTime(item.DueDate),
            Description: item.Description,
            Category: item.Category,
            StartDay: getDayOfYear(startDate),
            EndDay: getDayOfYear(dueDate),
            DueDate: item.DueDate,
          });
      });

      mappedItems.map((item) => {
        if (item.Category) {
          let wheel = donutWheelData.find((c) => c.category == item.Category);
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
            item.StartDay,
            item.EndDay,
            eventArcs,
            wheel.outerRadius,
            wheel.innerRadius,
            eventColour,
            item.Title,
            item.Id,
            wheel.startAngle,
            wheel.endAngle
          );
        }
      });

      eventArcs.forEach((event, index) => {
        let data = mappedItems.find((d) => d.Id == event.id);

        if (data.StartDay < 90 && data.StartDay > 0) {
          renderEventText(svgEl, index, event, data, 5, 40);
        } else if (data.StartDay > 90 && data.StartDay < 180) {
          renderEventText(svgEl, index, event, data, 5, -20);
        } else if (data.StartDay > 180 && data.StartDay < 270) {
          renderEventText(svgEl, index, event, data, 5, -20);
        } else if (data.StartDay > 270 && data.StartDay < 365) {
          renderEventText(svgEl, index, event, data, 5, 40);
        }

        svgEl
          .selectAll(`#arcLabel${library}${data.Id}`)
          .style('cursor', 'pointer')
          .on('mouseenter', (e) => {
            setTextValue(data.Title);
            setDateValue(data.StartDate + ' - ' + data.EndDate);
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
              StartDate: data.StartDate,
              DueDate: data.EndDate,
            });
            setIsModalOpen(true);
          });
      });
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
      <AddEventModal setItems={setItems} library={library} />
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
