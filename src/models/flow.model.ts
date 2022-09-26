export type ValueOption = {
  nextId: boolean | number;
  value: boolean | number | string;
  text: string;
  isSelected?: boolean;
};

export type Step = {
  id: number;
  name: string;
  text: string;
  valueOptions: ValueOption[];
};
