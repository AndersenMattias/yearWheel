import * as React from 'react';
import { useEffect, useState } from 'react';
import { useId } from '@fluentui/react-hooks';
import {
  Modal,
  TextField,
  DatePicker,
  defaultDatePickerStrings,
  Label,
} from '@fluentui/react';

import styles from '../Donut.module.scss';

import { IListItem, INewEvent } from '../interfaces/IDonut';

import { DefaultButton } from '@fluentui/react/lib/Button';
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownOption,
  IDropdownStyles,
} from '@fluentui/react/lib/Dropdown';
import { addToList, dateWithoutTime } from '../DonutHandler';
import { PrimaryButton } from '@microsoft/office-ui-fabric-react-bundle';

export interface AddEventModalProps {
  items: IListItem[];
  setItems: React.Dispatch<React.SetStateAction<IListItem[]>>;
  library: any;
}

export const AddEventModal = ({
  items,
  setItems,
  library,
}: AddEventModalProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const titleId = useId('title');

  const [selectedCategory, setSelectedcategory] = useState<IDropdownOption>();
  const [input, setInput] = useState<INewEvent>({
    id: 0,
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
  });

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

  useEffect(() => {
    if (input.title.length > 3) {
      setShowError(false);
      setErrorMessage('');
    }
  }, [input, input.title]);

  useEffect(() => {
    if (input.title || input.startDate || input.endDate !== '') {
      setShowError(false);
    }
  }, [input.title, input.category, input.startDate]);

  const onHandleSubmit = async () => {
    if (
      !input.title ||
      !selectedCategory ||
      !input.startDate ||
      !input.endDate
    ) {
      setErrorMessage('Alla fält måste fyllas i, vänligen försök igen.');
      setShowError(true);
    } else if (input.title.length < 3) {
      setErrorMessage('Titeln måste vara längre än tre tecken.');
      setShowError(true);
    } else if (input.startDate > input.endDate) {
      setErrorMessage('Startdatum är efter slutdatum.');
      setShowError(true);
    } else if (
      input.title &&
      selectedCategory &&
      input.startDate &&
      input.endDate
    ) {
      try {
        let counter = 0;
        let itemStartDay = new Date(input.startDate);
        let itemEndDay = new Date(input.endDate);
        items.forEach((listItem) => {
          let listItemStartDay = new Date(listItem.StartDate);
          let listItemEndDay = new Date(listItem.EndDate);

          if (
            selectedCategory.text == listItem.Category &&
            input.title != listItem.Title
          ) {
            //item between listitem
            if (
              itemStartDay >= listItemStartDay &&
              itemEndDay <= listItemEndDay
            ) {
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
          let returnInfo = await addToList(
            library,
            input.title,
            input.description,
            selectedCategory.text,
            input.startDate,
            input.endDate
          );
          const newEvent: IListItem = {
            Id: returnInfo.data.Id,
            Title: input.title,
            Description: input.description,
            Category: selectedCategory.text,
            StartDate: dateWithoutTime(input.startDate),
            EndDate: dateWithoutTime(input.endDate),
          };

          setItems((prev) => [...prev, newEvent]);
        } else {
          setShowError(true);
          setErrorMessage('Eventet får inte plats.');
          return;
        }

        input.title = '';
        input.description = '';
        input.startDate = '';
        setSelectedcategory(null);
        input.endDate = '';
        setErrorMessage('');
        setShowError(false);
      } catch (e) {
        setShowError(true);
        setErrorMessage('Något gick fel, försök igen.');
      }
      setIsModalOpen(false);
    }
  };

  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setSelectedcategory(item);
  };

  const ErrorMessage = (): JSX.Element => {
    return (
      <div>
        <p style={{ color: 'red' }}>{errorMessage}</p>
      </div>
    );
  };

  return (
    <>
      <DefaultButton
        onClick={() => setIsModalOpen(true)}
        text='Lägg till event'
      />
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        isBlocking={false}
      >
        <div className={styles.donut}>
          <div className={styles.addEventContainer}>
            <div>
              <h4>Lägg till event</h4>
            </div>
            <TextField
              className={styles.addEventInput}
              label='Titel'
              type='text'
              value={input.title}
              onChange={(_, value) =>
                setInput((prev) => ({ ...prev, title: value }))
              }
              maxLength={20}
            />
            <TextField
              className={styles.addEventInput}
              label='Beskrivning'
              multiline
              rows={3}
              value={input.description}
              onChange={(_, value) =>
                setInput((prev) => ({
                  ...prev,
                  description: value,
                }))
              }
            />
            <Dropdown
              className={styles.addEventInput}
              label='Kategori'
              selectedKey={input.category ? input.category : undefined}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={onChange}
              defaultValue=''
              placeholder='Välj kategori'
              options={categoryOptions}
            />
            <Label>Välj startdatum</Label>
            <DatePicker
              className={styles.addEventInput}
              ariaLabel='Välj ett datum'
              // DatePicker uses English strings by default. For localized apps, you must override this prop.
              strings={defaultDatePickerStrings}
              onSelectDate={(value) => {
                setInput((prev) => ({
                  ...prev,
                  startDate: value.toLocaleDateString('sv-SE'),
                }));
              }}
            />
            <Label>Välj slutdatum</Label>
            <DatePicker
              className={styles.addEventInput}
              ariaLabel='Välj ett datum'
              strings={defaultDatePickerStrings}
              onSelectDate={(value) => {
                setInput((prev) => ({
                  ...prev,
                  endDate: value.toLocaleDateString('sv-SE'),
                }));
              }}
            />
            <div className={styles.btnsAddContainer}>
              <div className={styles.btnsEvent}>
                <DefaultButton onClick={() => setIsModalOpen(false)}>
                  Avbryt
                </DefaultButton>
              </div>
              <div className={styles.btnsEvent}>
                <PrimaryButton onClick={onHandleSubmit}>
                  Lägg till
                </PrimaryButton>
              </div>
            </div>
            {showError && <ErrorMessage />}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddEventModal;
