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
  title?: string;
  description?: string;
  start?: any;
  end?: any;
  location?: string;
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
  collectionData: any[];
  eventListData: any
  selectedCategory: any
  circelOneTitle: string
  circleOneColour: string
  circleOneEvCol: string
  circleTwoTitle: string
  circleTwoColour: string
  circleTwoEvCol: string
  circleThreeTitle: string
  circleThreeColour: string
  circleThreeEvCol: string
  circleFourTitle: string
  circleFourColour: string
  circleFourEvCol: string
}

export interface IDonutWheelProps {
  collectionData: string | number | any;
  selectedCategory: any
  circelOneTitle: string
circleOneColour: string
circleOneEvCol: string
circleTwoTitle: string
circleTwoColour: string
circleTwoEvCol: string
circleThreeTitle: string
circleThreeColour: string
circleThreeEvCol: string
circleFourTitle: string
circleFourColour: string
circleFourEvCol: string
}

export interface IDonutModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  items?: any[];
  data: IListObj;
}

export interface IDonutWebPartProps {
  description: string;
  categoryOption: string;
  collectionData: any;
  colour: string;
  eventListData: any
selectedCategory: any
circelOneTitle: string
circleOneColour: string
circleOneEvCol: string
circleTwoTitle: string
circleTwoColour: string
circleTwoEvCol: string
circleThreeTitle: string
circleThreeColour: string
circleThreeEvCol: string
circleFourTitle: string
circleFourColour: string
circleFourEvCol: string
}

export interface IPropertyControlsTestWebPartProps {
  colour: string;
}

export interface INewEvent {
  title: string;
  description: string;
  category: string;
  startDate: string
  dueDate: string
}

export interface IEditEvent {
  title: string;
  description: string;
  category:string;
  startDate: string;
  dueDate: string

}
