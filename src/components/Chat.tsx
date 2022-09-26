import {
  Box,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Fragment, useEffect, useRef } from 'react';
import type { Step, ValueOption } from '../models';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(3),
    '&.Mui-disabled': {
      border: '1px solid rgba(0, 0, 0, 0.12)',
    },
    '&:not(:first-of-type)': {
      border: '1px solid rgba(0, 0, 0, 0.12)',
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

type Props = {
  flow: Step[];
  isFlowFinished: boolean;
  selectOption: (
    stepId: number,
    selectedOptionValue: boolean | number | string,
    nextId: number | boolean
  ) => void;
};

export const Chat = ({
  flow,
  isFlowFinished,
  selectOption,
}: Props): JSX.Element => {
  const matches = useMediaQuery('(min-width:600px)');

  const getSelectedValue = (
    valueOptions: ValueOption[]
  ): boolean | number | string | undefined =>
    valueOptions.find((value) => value.isSelected)?.value;

  const buttonGroupRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const lastOption = buttonGroupRefs.current.at(-1);
    lastOption?.scrollIntoView({ behavior: 'smooth' });
  }, [flow]);

  return (
    <Box sx={{ my: 4, padding: 4 }}>
      {flow.map(({ text, id, valueOptions }) => (
        <Fragment key={id}>
          <Typography variant="h3">{text}</Typography>
          <StyledToggleButtonGroup
            value={getSelectedValue(valueOptions)}
            exclusive
            aria-label={text}
            size="large"
            orientation={matches ? 'horizontal' : 'vertical'}
            ref={(el: HTMLElement) =>
              (buttonGroupRefs.current = [...buttonGroupRefs.current, el])
            }
          >
            {valueOptions.map(({ text: optionText, nextId, value }) => (
              <ToggleButton
                key={optionText}
                value={value}
                onClick={() => selectOption(id, value, nextId)}
                aria-label={optionText}
                disabled={isFlowFinished}
                sx={{ minWidth: 68 }}
              >
                {optionText}
              </ToggleButton>
            ))}
          </StyledToggleButtonGroup>
        </Fragment>
      ))}
    </Box>
  );
};
