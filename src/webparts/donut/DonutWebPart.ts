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
  PropertyPaneChoiceGroup
} from '@microsoft/sp-property-pane';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DonutWebPartStrings';
import { IDonutProps } from './components/IDonutProps';
import Donut from './components/Donut';
import DonutColorPicker from './components/DonutColorPicker';

import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';   
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';



export interface IDonutWebPartProps {
  description: string;
  secondCircleTitle: string
  thirdCircleTitle: string
  fourthCircleTitle: string;
  categoryOption: string;
  collectionData: any
  color: string
}

export interface IPropertyControlsTestWebPartProps {
  color: string;
}

export default class DonutWebPart extends BaseClientSideWebPart<IDonutWebPartProps> {
  
  public render(): void {

    
    const element: React.ReactElement<IDonutProps> = React.createElement(
      Donut,
      {
        description: this.properties.description,
        color: this.properties.color,
        collectionData: this.properties.collectionData
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [

                PropertyFieldCollectionData("collectionData", {  
                  key: "collectionData",  
                  label: "Collection data",  
                  panelHeader: "Collection data panel header",  
                  manageBtnLabel: "Settings",  
                  value: this.properties.collectionData,  
                  fields: [  
                      {  
                          id: "Category",  
                          title: "Kategori",  
                          type: CustomCollectionFieldType.string,  
                          
                      },  
                      {  
                          id: "Colour",  
                          title: "Färg",  
                          type: CustomCollectionFieldType.string  
                      }]

                }),

                // PropertyFieldColorPicker('color', {
                //   label: 'Color',
                //   selectedColor: this.properties.color,
                //   onPropertyChange: this.onPropertyPaneFieldChanged,
                //   properties: this.properties,
                //   disabled: false,
                //   debounce: 1000,
                //   isHidden: false,
                //   alphaSliderHidden: false,
                //   style: PropertyFieldColorPickerStyle.Full,
                //   iconName: 'Precipitation',
                //   key: 'colorFieldId'
                // })
    
                
           
              ]
            }
          ]
        }
      ]
    };
  }
}

