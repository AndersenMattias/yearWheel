import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DonutWebPartStrings';

import Donut from './components/Donut';

import {
  IDonutProps,
  IDonutWebPartProps,
} from './components/interfaces/IDonut';

import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneField,
  IPropertyPaneGroup,
  PropertyPaneDropdown,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';

export default class DonutWebPart extends BaseClientSideWebPart<IDonutWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IDonutProps> = React.createElement(
      Donut,
      {
        description: this.properties.description,
        colour: this.properties.colour,
        collectionData: this.properties.collectionData,
        eventListData: this.properties.eventListData,
        selectedCategory: this.properties.selectedCategory,
        circelOneTitle: this.properties.circelOneTitle,
        circleOneEvCol: this.properties.circleOneEvCol,
        circleOneColour: this.properties.circleOneColour,
        circleTwoColour: this.properties.circleTwoColour,
        circleTwoTitle: this.properties.circleTwoTitle,
        circleThreeTitle: this.properties.circleThreeTitle,
        circleTwoEvCol: this.properties.circleTwoEvCol,
        circleThreeEvCol: this.properties.circleThreeEvCol,
        circleThreeColour: this.properties.circleThreeColour,
        circleFourColour: this.properties.circleFourColour,
        circleFourTitle: this.properties.circleFourTitle,
        circleFourEvCol: this.properties.circleFourEvCol,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

  private displaySettings(): IPropertyPaneGroup {
    let groupFields: Array<IPropertyPaneField<any>> = new Array<
      IPropertyPaneField<any>
    >();
    let group: IPropertyPaneGroup = {
      groupName: 'Inställningar',
      groupFields: groupFields,
      isCollapsed: false,
    };

    if (this.properties.selectedCategory) {
      let circleTitle: IPropertyPaneField<any> = PropertyPaneTextField(
        this.properties.selectedCategory + 'Title',
        {
          label: 'Kategorinamn',
          value:
            this.properties.selectedCategory == 'circleOne' ? 'Generell' : '',
          disabled: this.properties.selectedCategory == 'circleOne',
          maxLength: 20,
        }
      );
      let circleColour: IPropertyPaneField<any> = PropertyPaneTextField(
        this.properties.selectedCategory + 'Colour',
        {
          label: 'Välj färg',
          maxLength: 10,
        }
      );

      let circleEvColour: IPropertyPaneField<any> = PropertyPaneTextField(
        this.properties.selectedCategory + 'EvCol',
        {
          label: 'Välj färg för event',
          maxLength: 10,
        }
      );

      groupFields.push(circleTitle);
      groupFields.push(circleColour);
      groupFields.push(circleEvColour);
    }

    return group;
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
                PropertyPaneDropdown('selectedCategory', {
                  label: 'Kategori',
                  options: [
                    { key: 'circleOne', text: 'Cirkel 1' },
                    { key: 'circleTwo', text: 'Cirkel 2' },
                    { key: 'circleThree', text: 'Cirkel 3' },
                    { key: 'circleFour', text: 'Cirkel 4' },
                  ],
                }),
              ],
            },
            this.displaySettings(),
          ],
        },
      ],
    };
  }
}
