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
  items,
  setItems,
}: IDonutModalProps): JSX.Element => {
  // const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
  //   useBoolean(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState<IEditEvent>({
    id: eventData.Id,
    title: eventData.Title,
    description: eventData.Description,
    category: eventData.Category,
    startDate: eventData.StartDate,
    dueDate: eventData.DueDate,
  });
  // Use useId() to ensure that the IDs are unique on the page.
  // (It's also okay to use plain strings and manually ensure uniqueness.)
  const titleId = useId('title');

  let list = sp.web.lists.getByTitle('EventPlanner');

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
      DueDate: updatedEvent.dueDate,
    };

    try {
      await list.items.getById(eventData.Id).update({
        Id: updatedEvent.id,
        Title: updatedEvent.title,
        Description: updatedEvent.description,
        Category: updatedEvent.category,
        StartDate: dateWithoutTime(updatedEvent.startDate),
        DueDate: dateWithoutTime(updatedEvent.dueDate),
      });
    } catch (e) {
      console.log(e);
    }

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
      DueDate: dateWithoutTime(updatedEvent.dueDate),
    });
    setEditMode(!editMode);
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

  return (
    <>
      <Modal
        className={styles.donut}
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        isBlocking={false}
      >
        {!editMode && (
          <div className={styles.eventHeader}>
            <div>
              <h2 id={titleId} style={{ paddingLeft: '1rem' }}>
                {eventData.Title}
              </h2>
            </div>
            <div>
              <IconButton
                className={styles.iconButtonStyles}
                iconProps={cancelIcon}
                ariaLabel='Close popup modal'
                onClick={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}

        {!editMode ? (
          <div className={styles.donut}>
            <div className={styles.eventContainer}>
              <div>
                <p>{eventData.Description}</p>
                <p>{eventData.StartDate + ' - ' + eventData.DueDate}</p>
              </div>
            </div>
            <div className={styles.btnsEvContainerModal}>
              <div className={styles.editEventBtn}>
                <PrimaryButton
                  text='Redigera'
                  onClick={() => setEditMode(!editMode)}
                />
              </div>
              <div className={styles.editEventBtn}>
                <DefaultButton text='Radera' onClick={onDeleteEvent} />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.donut}>
            <div className={styles.editEventContainer}>
              <div style={{ paddingTop: '1rem' }}>
                <Label className={styles.eventLabel}>Titel</Label>
                <TextField
                  className={styles.eventInput}
                  value={updatedEvent.title}
                  onChange={(e, value) => {
                    setUpdatedEvent((prev) => ({ ...prev, title: value }));
                  }}
                  maxLength={20}
                />
                <Label className={styles.eventLabel}>Beskrivning</Label>
                <TextField
                  className={styles.eventInput}
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
                      startDate: value.toLocaleDateString(),
                    }));
                  }}
                />
                <Label className={styles.eventLabel}>Välj slutdatum</Label>
                <DatePicker
                  allowTextInput={true}
                  className={styles.eventInput}
                  value={new Date(updatedEvent.dueDate)}
                  ariaLabel='Välj ett datum'
                  strings={defaultDatePickerStrings}
                  onSelectDate={(value) => {
                    setUpdatedEvent((prev) => ({
                      ...prev,
                      dueDate: value.toLocaleDateString(),
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
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

const cancelIcon: IIconProps = { iconName: 'Cancel' };

export default EventModal;
