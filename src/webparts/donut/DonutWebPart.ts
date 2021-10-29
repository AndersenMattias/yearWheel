import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneLabel,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneChoiceGroup,
} from '@microsoft/sp-property-pane';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DonutWebPartStrings';
import { IDonutProps } from './components/IDonutProps';
import Donut from './components/Donut';
import DonutColorPicker from './components/DonutColorPicker';

import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType,
} from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

export interface IDonutWebPartProps {
  description: string;
  secondCircleTitle: string;
  thirdCircleTitle: string;
  fourthCircleTitle: string;
  categoryOption: string;
  collectionData: any;
  colour: string;
}

export interface IPropertyControlsTestWebPartProps {
  colour: string;
}

export default class DonutWebPart extends BaseClientSideWebPart<IDonutWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IDonutProps> = React.createElement(
      Donut,
      {
        description: this.properties.description,
        colour: this.properties.colour,
        collectionData: this.properties.collectionData,
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
                  manageBtnLabel: 'Settings',
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
              ],
            },
          ],
        },
      ],
    };
  }
}
