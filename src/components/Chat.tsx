import { Typography } from '@mui/material';
import { Fragment } from 'react';
import type { Step } from '../models';

type Props = {
  flow: Step[];
  selectOption: (
    stepId: number,
    selectedOptionValue: boolean | number | string,
    nextId: number | boolean
  ) => void;
};

export const Chat = ({ flow, selectOption }: Props): JSX.Element => {
  return (
    <>
      {flow.map(({ text, id, valueOptions, name }) => (
        <Fragment key={id}>
          <Typography variant="h3">{text}</Typography>
          <div>
            {valueOptions.map(({ text: optionText, nextId, value }, index) => (
              <Fragment key={optionText}>
                <div key={optionText}>
                  <input
                    id={`${name}-${index}`}
                    type="radio"
                    name={name}
                    value={optionText}
                    onChange={(e) => {
                      e.target.checked && selectOption(id, value, nextId);
                    }}
                  />
                  <label htmlFor={`${name}-${index}`}>{optionText}</label>
                </div>
              </Fragment>
            ))}
          </div>
        </Fragment>
      ))}
    </>
  );
};
