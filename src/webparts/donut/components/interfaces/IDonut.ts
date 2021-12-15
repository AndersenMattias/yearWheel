export interface Arc {
  arcSvg: any;
  colour?: string;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  category: string;
}

export interface IListObj {
  Id?: number;
  Title?: string;
  Category?: string;
  Description?: string;
  StartDate?: any;
  EndDate?: any;
}

export interface IListEvent {
  Title?: any;
  Category?: any;
  Description?: any;
  StartDate?: any;
  DueDate?: any;
}

export interface IDonutProps {
  description: string;
  colour: string;
  eventListData: any;
  selectedCategory: any;
  library: any;
  colorPicker: string;
  circelOneTitle: string;
  circleOneEvCol: string;
  circleTwoTitle: string;
  circleTwoEvCol: string;
  circleThreeTitle: string;
  circleThreeEvCol: string;
  circleFourTitle: string;
  circleFourEvCol: string;
}

export interface IDonutWheelProps {
  selectedCategory: any;
  library: any;
  colorPicker: string;
  circelOneTitle: string;
  circleOneEvCol: string;
  circleTwoTitle: string;
  circleTwoEvCol: string;
  circleThreeTitle: string;
  circleThreeEvCol: string;
  circleFourTitle: string;
  circleFourEvCol: string;
}

export interface IDonutModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  items?: any[];
  setItems?: any;
  eventData: IListObj;
  setEventData: any;
  library: any;
}

export interface IDonutWebPartProps {
  colorPicker: string;
  description: string;
  categoryOption: string;
  colour: string;
  eventListData: any;
  selectedCategory: any;
  selectedLibrary: any;
  circelOneTitle: string;
  circleOneEvCol: string;
  circleTwoTitle: string;
  circleTwoEvCol: string;
  circleThreeTitle: string;
  circleThreeEvCol: string;
  circleFourTitle: string;
  circleFourEvCol: string;
}

export interface IPropertyControlsTestWebPartProps {
  colour: string;
}

export interface INewEvent {
  id?: number;
  title: string;
  description: string;
  category: string;
  startDate: any;
  endDate: any;
}

export interface IEditEvent {
  id: number;
  title: string;
  description: string;
  category: any;
  startDate: any;
  endDate: any;
}

export interface IListItem {
  Id: number;
  Title: string;
  StartDate: any;
  EndDate: any;
  Description: string;
  Category: string;
  StartDay?: number;
  EndDay?: number;
  RenderUpper?: boolean;
  itemStartDay?: Date;
  itemEndDay?: Date;
}

export interface IPropertyControlsTestWebPartProps {
  color: string;
}
