export interface FlowDTO {
  id: number;
  name: string;
  text: string;
  uiType: string;
  valueType: 'boolean' | 'number' | 'string';
  valueOptions: ValueOptionsEntity[];
}
export type ValueOptionsEntity = {
  nextId: boolean | number;
  value: boolean | number | string;
  text: string;
};
