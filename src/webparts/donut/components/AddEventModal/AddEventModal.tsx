import * as React from 'react';
import { useEffect, useState } from 'react';
import { useId } from '@fluentui/react-hooks';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  Modal,
  IIconProps,
  IStackProps,
  TextField,
  DatePicker,
  defaultDatePickerStrings,
  Label,
} from '@fluentui/react';

import { INewEvent } from '../interfaces/IDonut';

import {
  DefaultButton,
  IconButton,
  IButtonStyles,
} from '@fluentui/react/lib/Button';
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownOption,
  IDropdownStyles,
} from '@fluentui/react/lib/Dropdown';
import { addToList, dateWithoutTime } from '../DonutHandler';
import { PrimaryButton } from '@microsoft/office-ui-fabric-react-bundle';

export const AddEventModal = ({
  items,
  setItems,
  library,
}: any): JSX.Element => {
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
    dueDate: '',
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

  const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

  useEffect(() => {
    if (input.title.length > 3 || input.description.length > 5) {
      setShowError(false);
      setErrorMessage('');
    }
  }, [input, input.title, input.description]);

  useEffect(() => {
    if (
      input.title ||
      input.description ||
      input.startDate ||
      input.dueDate !== ''
    ) {
      setShowError(false);
    }
  }, [input.title, input.description, input.category, input.startDate]);

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !input.title ||
      !input.description ||
      !selectedCategory ||
      !input.startDate ||
      !input.dueDate
    ) {
      setErrorMessage('Alla fält måste fyllas i, vänligen försök igen.');
      setShowError(true);
    } else if (input.title.length < 3) {
      setErrorMessage('Titeln måste vara längre än tre tecken.');
      setShowError(true);
    } else if (input.description.length < 5) {
      setErrorMessage('Beskrivningen måste vara längre än fem tecken.');
      setShowError(true);
    } else if (input.startDate > input.dueDate) {
      setErrorMessage('aja baja.');
      setShowError(true);
    } else if (
      input.title &&
      input.description &&
      selectedCategory &&
      input.startDate &&
      input.dueDate
    ) {
      try {
        let returnInfo = await addToList(
          library,
          input.title,
          input.description,
          selectedCategory.text,
          input.startDate,
          input.dueDate
        );

        items.forEach((item) => {
          let counter = 0;

          items.forEach((listItem) => {
            if (
              item.Category == listItem.Category &&
              item.Title != listItem.Title
            ) {
              //item between listitem
              if (
                item.StartDay >= listItem.StartDay &&
                item.EndDay <= listItem.EndDay
              ) {
                counter++;
              }
              //listItem between item
              else if (
                item.StartDay <= listItem.StartDay &&
                item.EndDay >= listItem.EndDay
              ) {
                counter++;
              }
              //item starts before, ends after listitem start
              else if (
                item.StartDay <= listItem.StartDay &&
                item.EndDay >= listItem.StartDay
              ) {
                counter++;
              }
              //item ends after, starts during
              else if (
                item.StartDay >= listItem.StartDay &&
                item.StartDay <= listItem.EndDay
              ) {
                counter++;
              }
            }

            console.log(counter);
          });

          if (counter < 2) {
            const newEvent = {
              Id: returnInfo.data.Id,
              Title: input.title,
              Description: input.description,
              Category: selectedCategory.text,
              StartDate: dateWithoutTime(input.startDate),
              DueDate: dateWithoutTime(input.dueDate),
            };

            setItems((prev) => [...prev, newEvent]);
          }
        });

        input.title = '';
        input.description = '';
        input.startDate = '';
        setSelectedcategory(null);
        input.dueDate = '';
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
    <div>
      <DefaultButton
        onClick={() => setIsModalOpen(true)}
        text='Lägg till event'
      />
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        isBlocking={false}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <span id={titleId}>Lägg till event</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel='Close popup modal'
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <div className={contentStyles.body}>
          <form onSubmit={onHandleSubmit}>
            <TextField
              label='Titel'
              type='text'
              value={input.title}
              onChange={(_, value) =>
                setInput((prev) => ({ ...prev, title: value }))
              }
              maxLength={20}
            />
            <TextField
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
              label='Kategori'
              selectedKey={input.category ? input.category : undefined}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={onChange}
              defaultValue=''
              placeholder='Välj kategori'
              options={categoryOptions}
              styles={dropdownStyles}
            />
            <Label>Välj startdatum</Label>
            <DatePicker
              ariaLabel='Välj ett datum'
              // DatePicker uses English strings by default. For localized apps, you must override this prop.
              strings={defaultDatePickerStrings}
              onSelectDate={(value) => {
                setInput((prev) => ({
                  ...prev,
                  startDate: value,
                }));
              }}
            />
            <Label>Välj slutdatum</Label>
            <DatePicker
              ariaLabel='Välj ett datum'
              strings={defaultDatePickerStrings}
              onSelectDate={(value) => {
                setInput((prev) => ({
                  ...prev,
                  dueDate: value,
                }));
              }}
            />

            <PrimaryButton type='submit'>Lägg till</PrimaryButton>
          </form>
          {showError && <ErrorMessage />}
        </div>
      </Modal>
    </div>
  );
};

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    // eslint-disable-next-line deprecation/deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});
const stackProps: Partial<IStackProps> = {
  horizontal: true,
  tokens: { childrenGap: 40 },
  styles: { root: { marginBottom: 20 } },
};
const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

export default AddEventModal;
