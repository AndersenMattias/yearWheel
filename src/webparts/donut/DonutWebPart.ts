import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DonutWebPartStrings';

import Donut from './components/Donut';

import {
  IDonutProps,
  IDonutWebPartProps,
  IPropertyControlsTestWebPartProps,
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

import {
  PropertyFieldColorPicker,
  PropertyFieldColorPickerStyle,
} from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';

export default class DonutWebPart extends BaseClientSideWebPart<IDonutWebPartProps> {
  private libraries: any;
  public render(): void {
    const element: React.ReactElement<IDonutProps> = React.createElement(
      Donut,
      {
        description: this.properties.description,
        colour: this.properties.colour,
        // collectionData: this.properties.collectionData,
        eventListData: this.properties.eventListData,
        selectedCategory: this.properties.selectedCategory,
        library: this.properties.selectedLibrary,
        colorPicker: this.properties.colorPicker,
        circelOneTitle: this.properties.circelOneTitle,
        circleOneEvCol: this.properties.circleOneEvCol,
        circleTwoTitle: this.properties.circleTwoTitle,
        circleThreeTitle: this.properties.circleThreeTitle,
        circleTwoEvCol: this.properties.circleTwoEvCol,
        circleThreeEvCol: this.properties.circleThreeEvCol,
        circleFourTitle: this.properties.circleFourTitle,
        circleFourEvCol: this.properties.circleFourEvCol,
      }
    );
    this.getLibraries();

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  public async getLibraries() {
    this.libraries = await sp.web.lists.get();
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

      const parseColorProp = {
        circleOneEvCol: this.properties.circleOneEvCol,
        circleTwoEvCol: this.properties.circleTwoEvCol,
        circleThreeEvCol: this.properties.circleThreeEvCol,
        circleFourEvCol: this.properties.circleFourEvCol,
      };
      let circleColourPick: IPropertyPaneField<any> = PropertyFieldColorPicker(
        this.properties.selectedCategory + 'EvCol',
        {
          label: 'Color',
          selectedColor:
            parseColorProp[this.properties.selectedCategory + 'EvCol'], //this.properties.colorPicker,
          onPropertyChange: this.onPropertyPaneFieldChanged,
          properties: this.properties,
          disabled: false,
          debounce: 1000,
          isHidden: false,
          alphaSliderHidden: true,
          style: PropertyFieldColorPickerStyle.Full,
          iconName: 'Precipitation',
          key: 'colorFieldId',
        }
      );

      groupFields.push(circleTitle);
      // groupFields.push(circleEvColour);
      groupFields.push(circleColourPick);
    }

    return group;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    let libraryOptions = [];
    this.libraries.forEach((library) => {
      if (!library.Hidden && library.BaseTemplate === 100) {
        libraryOptions.push({ key: library.Title, text: library.Title });
      }
    });
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
                PropertyPaneDropdown('selectedLibrary', {
                  label: 'Välj lista',
                  options: libraryOptions,
                }),
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
