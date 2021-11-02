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
  eventListData: any[];
}

export interface IDonutWheelProps {
  collectionData: string | number | any;
  eventListData: string | number | any;
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
  eventListData: any;
  colour: string;
}

export interface IPropertyControlsTestWebPartProps {
  colour: string;
}
