import * as React from 'react';
import { useEffect, useState } from 'react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Toggle,
  Modal,
  IDragOptions,
  IIconProps,
  Stack,
  IStackProps,
  TextField,
  Dropdown,
  IDropdownOption,
  DropdownMenuItemType,
  IDropdownStyles,
} from '@fluentui/react';

import { IEditEvent } from '../interfaces/IDonut';

import {
  DefaultButton,
  IconButton,
  IButtonStyles,
} from '@fluentui/react/lib/Button';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { dateWithoutTime, onUpdateEvent } from '../DonutHandler';

export const HandleEventModal = ({ items, setItems }: any): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedCategory, setSelectedcategory] = useState<IDropdownOption>();
  const [input, setInput] = useState<IEditEvent>({
    Title: '',
    Description: '',
    Category: '',
    StartDate: '',
    DueDate: '',
  });
  useEffect(() => {}, [items]);

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

  const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

  const onDeleteEvent = async (id: number) => {
    const deleteEvent = await list.items.getById(id).delete();
    return deleteEvent;
  };

  const dateJSONToEDM = (jsonDate) => {
    const content = /\d+/.exec(String(jsonDate));
    const timestamp = content ? Number(content[0]) : 0;
    const date = new Date(timestamp);
    const string = date.toISOString();
    return string;
  };

  // const onUpdateEvent = async (
  //   id: number,
  //   title,
  //   description,
  //   category,
  //   startDate,
  //   dueDate
  // ) => {
  //   const eventUpdated = {
  //     Title: input.Title,
  //     Description: input.Description,
  //     Category: selectedCategory.text,
  //     StartDate: input.StartDate,
  //     DueDate: input.DueDate,
  //   };
  //   const updateEvent = await list.items.getById(id).update({
  //     Title: title,
  //     Description: description,
  //     Category: category,
  //     StartDate: dateJSONToEDM(startDate),
  //     DueDate: dateJSONToEDM(dueDate),
  //   });
  //   setItems((prev) => [...prev, updateEvent]);
  //   // return updateEvent;
  // };

  const titleId = useId('title');

  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(
    //   input.Title,
    //   selectedCategory.text,
    //   input.Description,
    //   input.Category,
    //   input.StartDate,
    //   input.DueDate
    // );
  };

  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setSelectedcategory(item);
  };

  const mappedItems = items.map((item) => {
    return (
      <form onSubmit={onHandleSubmit}>
        <TextField
          label='Titel'
          type='text'
          value={item.Title}
          onChange={(_, value) =>
            setInput((prev) => ({ ...prev, Title: value }))
          }
        />
        <TextField
          label='Beskrivning'
          multiline
          rows={3}
          value={item.Description}
          onChange={(_, value) =>
            setInput((prev) => ({
              ...prev,
              Description: value,
            }))
          }
        />
        <Dropdown
          label='Kategori'
          selectedKey={input.Category ? input.Category : undefined}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={onChange}
          placeholder={item.Category}
          options={categoryOptions}
          styles={dropdownStyles}
        />

        <TextField
          label='Startdatum'
          type='date'
          value={dateWithoutTime(item.StartDate)}
          onChange={(_, value) =>
            setInput((prev) => ({ ...prev, StartDate: value }))
          }
        />
        <TextField
          label='Slutdatum'
          type='date'
          value={dateWithoutTime(item.DueDate)}
          onChange={(_, value) =>
            setInput((prev) => ({ ...prev, DueDate: value }))
          }
        />
        <DefaultButton onClick={() => onDeleteEvent(item.Id)}>
          Radera
        </DefaultButton>
        <DefaultButton
        // type='submit'
        // // onClick={() =>
        // //   onUpdateEvent(
        // //     item.Id,
        // //     item.Title,
        // //     item.Description,
        // //     item.Category,
        // //     item.Startdate,
        // //     item.DueDate
        // //   )
        // // }
        >
          Spara
        </DefaultButton>
      </form>
    );
  });

  return (
    <div>
      <DefaultButton
        onClick={() => setIsModalOpen(true)}
        text='Hantera event'
      />
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        isBlocking={false}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <span id={titleId}>Hantera event</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel='Close popup modal'
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <div className={contentStyles.body}>{mappedItems}</div>
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

export default HandleEventModal;
