import { useCallback, useEffect, useState } from 'react';
import type { Request, Step } from '../models';
import { PUT_API_URL } from '../services';

export const useSendPut = (flow: Step[], shouldSend: boolean): Request => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  const sendPUTRequest = useCallback(() => {
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

    setIsLoading(true);
    setError(undefined);
    fetch(PUT_API_URL, requestOptions)
      .then((response) => response.text())
      .then(() => setIsSuccess(true))
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [flow]);

  useEffect(() => {
    if (shouldSend) {
      sendPUTRequest();
    }
  }, [sendPUTRequest, shouldSend]);

  return { isSuccess, error, isLoading, sendPUTRequest };
};
