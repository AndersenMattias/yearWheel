import * as React from 'react';
import { useState } from 'react';

import { IDonutModalProps, IEditEvent } from '../interfaces/IDonut';

import { useId } from '@fluentui/react-hooks';

import styles from '../Donut.module.scss';

import {
  Modal,
  IIconProps,
  TextField,
  Label,
  DatePicker,
  defaultDatePickerStrings,
  FontIcon,
} from '@fluentui/react';
import {
  DefaultButton,
  IconButton,
  PrimaryButton,
} from '@fluentui/react/lib/Button';

import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
} from '@fluentui/react/lib/Dropdown';

import { sp } from '@pnp/sp';
import { dateWithoutTime } from '../DonutHandler';

export const EventModal = ({
  isModalOpen,
  setIsModalOpen,
  eventData,
  setEventData,
  library,
  items,
  setItems,
}: IDonutModalProps): JSX.Element => {
  const [editMode, setEditMode] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState<IEditEvent>({
    id: eventData.Id,
    title: eventData.Title,
    description: eventData.Description,
    category: eventData.Category,
    startDate: eventData.StartDate,
    endDate: eventData.EndDate,
  });
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const titleId = useId('title');

  let list = sp.web.lists.getByTitle(library);

  const categoryOptions = [
    {
      key: 'categoryHeader',
      text: 'Kategorier',
      itemType: DropdownMenuItemType.Header,
    },
    { key: 'Generell', text: 'Generell' },
    { key: 'Kategori 1', text: 'Kategori 1' },
    { key: 'Kategori 2', text: 'Kategori 2' },
    { key: 'Kategori 3', text: 'Kategori 3' },
  ];

  const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 200 } };

  const onUpdateEvent = async () => {
    const updateEvent = {
      Id: updatedEvent.id,
      Title: updatedEvent.title,
      Description: updatedEvent.description,
      Category: updatedEvent.category,
      StartDate: updatedEvent.startDate,
      EndDate: updatedEvent.endDate,
    };

    let counter = 0;
    let itemStartDay = new Date(updatedEvent.startDate);
    let itemEndDay = new Date(updatedEvent.endDate);
    items.forEach((listItem) => {
      let listItemStartDay = new Date(listItem.StartDate);
      let listItemEndDay = new Date(listItem.EndDate);

      if (
        updatedEvent.category == listItem.Category &&
        updatedEvent.title != listItem.Title
      ) {
        //item between listitem
        if (itemStartDay >= listItemStartDay && itemEndDay <= listItemEndDay) {
          counter++;
        }
        //listItem between item
        else if (
          itemStartDay <= listItemStartDay &&
          itemEndDay >= listItemEndDay
        ) {
          counter++;
        }
        //item starts before, ends after listitem start
        else if (
          itemStartDay <= listItemStartDay &&
          itemEndDay >= listItemEndDay
        ) {
          counter++;
        }
        //item ends after, starts during
        else if (
          itemStartDay >= listItemStartDay &&
          itemStartDay <= listItemEndDay
        ) {
          counter++;
        } else if (
          itemStartDay <= listItemStartDay &&
          itemEndDay <= listItemEndDay &&
          itemEndDay >= listItemStartDay
        ) {
          counter++;
        }
      }
    });

    if (counter < 2) {
      if (updatedEvent.startDate > updatedEvent.endDate) {
        setShowError(true);
        setErrorMessage('Ett event kan inte börja före det slutar.');
        return;
      }
      let returnInfo = await list.items.getById(eventData.Id).update({
        Id: updatedEvent.id,
        Title: updatedEvent.title,
        Description: updatedEvent.description,
        Category: updatedEvent.category,
        StartDate: dateWithoutTime(updatedEvent.startDate),
        EndDate: dateWithoutTime(updatedEvent.endDate),
      });

      setItems((prevItems) => {
        const items: [] = prevItems.map((item) => {
          if (item.Id == updateEvent.Id) {
            return updateEvent;
          } else {
            return item;
          }
        });
        return items;
      });
      setEventData({
        ...eventData,
        Id: updatedEvent.id,
        Title: updatedEvent.title,
        Description: updatedEvent.description,
        Category: updatedEvent.category,
        StartDate: dateWithoutTime(updatedEvent.startDate),
        EndDate: dateWithoutTime(updatedEvent.endDate),
      });
      setEditMode(!editMode);
    } else {
      setShowError(true);
      setErrorMessage('Ont om plats, aj aj.');
      return;
    }
  };

  const onDeleteEvent = async () => {
    try {
      await list.items.getById(eventData.Id).delete();
      setItems(items.filter((item) => item.Id !== eventData.Id));
    } catch (e) {
      console.log(e);
    }
    setIsModalOpen(false);
  };

  const ErrorMessage = (): JSX.Element => {
    return (
      <div>
        <p style={{ color: 'red' }}>{errorMessage}</p>
      </div>
    );
  };

  return (
    <Modal
      className={styles.donut}
      titleAriaId={titleId}
      isOpen={isModalOpen}
      onDismiss={() => setIsModalOpen(false)}
      isBlocking={false}
    >
      {!editMode && (
        <div className={styles.eventHeader}>
          <h2 id={titleId}>{eventData.Title}</h2>
          <IconButton
            className={styles.iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel='Close popup modal'
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      )}

      {!editMode ? (
        <>
          <div className={styles.eventContainer}>
            <p>{eventData.Description}</p>
            <div className={styles.eventDateContainer}>
              <div>
                <FontIcon
                  aria-label='Calendar'
                  iconName='Calendar'
                  className={styles.calendarIcon}
                />
              </div>
              <div style={{ marginLeft: 20 }}>
                {eventData.StartDate + ' - ' + eventData.EndDate}
              </div>
            </div>
          </div>
          <div className={styles.btnsEvContainerModal}>
            <div className={styles.editEventBtn}>
              <DefaultButton text='Radera' onClick={onDeleteEvent} />
            </div>
            <div className={styles.editEventBtn}>
              <PrimaryButton
                text='Redigera'
                onClick={() => setEditMode(!editMode)}
              />
            </div>
          </div>
        </>
      ) : (
        <div className={styles.editEventContainer}>
          <div style={{ paddingTop: '1rem' }}>
            <Label className={styles.eventLabel}>Titel</Label>
            <TextField
              className={styles.eventInput}
              value={updatedEvent.title}
              onChange={(e, value) => {
                setUpdatedEvent((prev) => ({ ...prev, title: value }));
              }}
            />
            <Label className={styles.eventLabel}>Beskrivning</Label>
            <TextField
              className={styles.eventInput}
              multiline
              rows={3}
              value={updatedEvent.description}
              onChange={(e, value) => {
                setUpdatedEvent((prev) => ({
                  ...prev,
                  description: value,
                }));
              }}
            />
            <Dropdown
              className={styles.eventInput}
              label='Kategori'
              selectedKey={
                updatedEvent.category ? updatedEvent.category : undefined
              }
              // eslint-disable-next-line react/jsx-no-bind
              onChange={(e, value) => {
                setUpdatedEvent((prev) => ({
                  ...prev,
                  category: value.text,
                }));
              }}
              placeholder={updatedEvent.category}
              options={categoryOptions}
              styles={dropdownStyles}
            />

            <Label className={styles.eventLabel}>Välj startdatum</Label>
            <DatePicker
              className={styles.eventInput}
              value={new Date(updatedEvent.startDate)}
              ariaLabel='Välj ett datum'
              // DatePicker uses English strings by default. For localized apps, you must override this prop.
              strings={defaultDatePickerStrings}
              onSelectDate={(value) => {
                setUpdatedEvent((prev) => ({
                  ...prev,
                  startDate: value.toLocaleDateString('sv-SE'),
                }));
              }}
            />
            <Label className={styles.eventLabel}>Välj slutdatum</Label>
            <DatePicker
              allowTextInput={true}
              className={styles.eventInput}
              value={new Date(updatedEvent.endDate)}
              ariaLabel='Välj ett datum'
              strings={defaultDatePickerStrings}
              onSelectDate={(value) => {
                setUpdatedEvent((prev) => ({
                  ...prev,
                  endDate: value.toLocaleDateString('sv-SE'),
                }));
              }}
            />

            <div className={styles.btnsEvContainer}>
              <div className={styles.btnsEvent}>
                <DefaultButton
                  text='Avbryt'
                  onClick={() => setEditMode(!editMode)}
                />
              </div>
              <div className={styles.btnsEvent}>
                <PrimaryButton text='Spara' onClick={onUpdateEvent} />
              </div>
            </div>
            {showError && <ErrorMessage />}
          </div>
        </div>
      )}
    </Modal>
  );
};

const cancelIcon: IIconProps = { iconName: 'Cancel' };

export default EventModal;
