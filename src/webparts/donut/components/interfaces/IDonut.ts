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

export interface IDonutWheelProps {
  collectionData: string | number | any;
}

export interface IDonutModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  items?: any[];
  data: IListObj;
}
