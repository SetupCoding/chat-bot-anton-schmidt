import type { FlowDTO, Step, ValueOption, ValueOptionsEntity } from '../models';

const FLOW_FETCH_URL =
  'https://raw.githubusercontent.com/mzronek/task/main/flow.json';

export const PUT_API_URL =
  'https://virtserver.swaggerhub.com/L8475/task/1.0.1/conversation';

export const sendPUT = (flow: Step[]): Promise<any> => {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      flow.map(({ name, valueOptions }) => ({
        name,
        value: valueOptions.find(({ isSelected }) => isSelected)?.value,
      }))
    ),
  };

  return fetch(PUT_API_URL, requestOptions).then((response) => response.text());
};

export const fetchFlowData = async (): Promise<{
  flowData: Step[];
  errorMessage?: string;
}> => {
  const response = await fetch(FLOW_FETCH_URL);

  let errorMessage: string | undefined = undefined;
  let flowData: Step[] = [];

  if (!response.ok) {
    errorMessage = `Ein Fehler ist aufgetreten: ${response.status}`;
  } else {
    const flowJSON: FlowDTO[] = await response.json();
    flowData = flowJSON.map(toFlowData);
  }

  return { flowData, ...(errorMessage && { errorMessage }) };
};

const toFlowData = (flowData: FlowDTO): Step => ({
  id: flowData.id,
  name: flowData.name,
  text: flowData.text,
  valueOptions: flowData.valueOptions.map(toValueOptions),
});

const toValueOptions = (valueOptions: ValueOptionsEntity): ValueOption => ({
  nextId: valueOptions.nextId,
  value: valueOptions.value,
  text: valueOptions.text,
});
