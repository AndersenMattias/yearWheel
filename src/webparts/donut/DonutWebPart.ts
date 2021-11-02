import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DonutWebPartStrings';

import Donut from './components/Donut';

import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType,
} from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

import {
  DateTimePicker,
  DateConvention,
  TimeConvention,
} from '@pnp/spfx-controls-react/lib/DateTimePicker';

import {
  IDonutProps,
  IDonutWebPartProps,
} from './components/interfaces/IDonut';

export default class DonutWebPart extends BaseClientSideWebPart<IDonutWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IDonutProps> = React.createElement(
      Donut,
      {
        description: this.properties.description,
        colour: this.properties.colour,
        collectionData: this.properties.collectionData,
        eventListData: this.properties.eventListData,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldCollectionData('collectionData', {
                  key: 'collectionData',
                  label: 'Collection data',
                  panelHeader: 'Collection data panel header',
                  manageBtnLabel: 'Inställningar',
                  value: this.properties.collectionData,
                  fields: [
                    {
                      id: 'categoryName',
                      title: 'Kategori namn',
                      type: CustomCollectionFieldType.string,
                    },
                    {
                      id: 'choosenCategory',
                      title: 'Välj kategori',
                      type: CustomCollectionFieldType.dropdown,
                      options: [
                        {
                          key: 'Generell',
                          text: 'Generell',
                        },
                        {
                          key: 'Kategori 1',
                          text: 'Cirkel två - Kategori 1',
                        },
                        {
                          key: 'Kategori 2',
                          text: 'Cirkel tre - Kategori 2',
                        },
                        {
                          key: 'Kategori 3',
                          text: 'Cirkel fyra - Kategori 3',
                        },
                      ],
                      required: true,
                    },
                    {
                      id: 'Colour',
                      title: 'Färg',
                      type: CustomCollectionFieldType.string,
                    },
                    {
                      id: 'eventColour',
                      title: 'Välj färg för inlagda event',
                      type: CustomCollectionFieldType.string,
                    },
                  ],
                }),

                PropertyFieldCollectionData('eventListData', {
                  key: 'collectionDataFieldId',
                  label: '',
                  panelHeader: 'Lägg till event',
                  manageBtnLabel: 'Lägg till event',
                  value: this.properties.eventListData,
                  fields: [
                    {
                      id: 'eventTitle',
                      title: 'Titel',
                      type: CustomCollectionFieldType.string,
                    },
                    {
                      id: 'selectedCategory',
                      title: 'Välj kategori',
                      type: CustomCollectionFieldType.dropdown,
                      options: [
                        {
                          key: 'Generell',
                          text: 'Generell',
                        },
                        {
                          key: 'Kategori 1',
                          text: 'Cirkel två',
                        },
                        {
                          key: 'Kategori 2',
                          text: 'Cirkel tre',
                        },
                        {
                          key: 'Kategori 3',
                          text: 'Cirkel fyra',
                        },
                      ],
                      required: true,
                    },
                    {
                      id: 'eventDescription',
                      title: 'Beskrivning',
                      type: CustomCollectionFieldType.string,
                    },
                    {
                      id: 'categoryColour',
                      title: 'Färg för cirkeln',
                      type: CustomCollectionFieldType.string,
                    },
                    {
                      id: 'eventColour',
                      title: 'Välj färg för event',
                      type: CustomCollectionFieldType.string,
                    },
                    {
                      id: 'startDate',
                      title: 'Startdatum',
                      type: CustomCollectionFieldType.custom,
                      required: false,
                      onCustomRender: (
                        field,
                        value,
                        onUpdate,
                        item,
                        itemId
                      ) => {
                        return React.createElement(DateTimePicker, {
                          key: itemId,
                          showLabels: false,
                          dateConvention: DateConvention.Date,
                          showGoToToday: true,
                          showMonthPickerAsOverlay: true,
                          value: value ? new Date(value) : null,
                          onChange: (date: Date) => {
                            onUpdate(field.id, date);
                          },
                        });
                      },
                    },
                    {
                      id: 'endDate',
                      title: 'Slutdatum',
                      type: CustomCollectionFieldType.custom,
                      required: false,
                      onCustomRender: (
                        field,
                        value,
                        onUpdate,
                        item,
                        itemId
                      ) => {
                        return React.createElement(DateTimePicker, {
                          key: itemId,
                          showLabels: false,
                          dateConvention: DateConvention.Date,
                          showGoToToday: true,
                          showMonthPickerAsOverlay: true,
                          value: value ? new Date(value) : null,
                          onChange: (date: Date) => {
                            onUpdate(field.id, date);
                          },
                        });
                      },
                    },
                  ],
                  disabled: false,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
