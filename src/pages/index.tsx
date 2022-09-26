import { Box, Container, Typography } from '@mui/material';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useEffect, useState } from 'react';
import { Chat } from '../components';
import type { RequestState, Step } from '../models';
import { fetchFlowData, sendPUT } from '../services';
import { deepCopy } from '../utils/deepCopy';

type Props = {
  flowData: Step[];
  errorMessage?: string;
};

export const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ flowData, errorMessage }) => {
  const flowDataMutable = deepCopy<Step[]>(flowData);

  const getStepById = (id: number | boolean): Step | undefined =>
    typeof id === 'boolean'
      ? undefined
      : flowDataMutable.find((step) => step.id === id);

  const firstStep = getStepById(100) as Step;

  const [flow, setFlow] = useState<Step[]>([firstStep]);
  const [isFlowFinished, setIsFlowFinished] = useState(false);
  const [requestState, setRequestState] = useState<RequestState>({
    isLoading: false,
    isSuccess: false,
  });

  useEffect(() => {
    if (isFlowFinished) {
      sendPUTRequest();
    }
  }, [isFlowFinished]);

  const selectOption = (
    stepId: number,
    selectedOptionValue: boolean | number | string,
    nextId: number | boolean
  ): void => {
    setFlow((prev) => {
      const updatedState = [...prev];
      const indexToUpdate = updatedState.findIndex(
        (step) => step.id === stepId
      );
      const nextStep = getStepById(nextId);

      // update flow if a previous selection was changed
      if (indexToUpdate < updatedState.length - 1) {
        updatedState.length = indexToUpdate + 1;
      }

      // change selected option value
      updatedState[indexToUpdate]?.valueOptions.forEach((option) => {
        option.isSelected = option.value === selectedOptionValue;
      });

      if (nextStep) {
        updatedState.push({ ...nextStep });
      } else {
        setIsFlowFinished(true);
      }

      return updatedState;
    });
  };

  const sendPUTRequest = () => {
    setRequestState({
      isSuccess: false,
      isLoading: true,
      error: undefined,
    });

    sendPUT(flow)
      .then(() => {
        setRequestState({ isSuccess: true });
      })
      .catch((error: Error) => {
        setRequestState({ isSuccess: false, error });
      })
      .finally(() => {
        setRequestState((prev) => ({ ...prev, isLoading: false }));
      });
  };

  return (
    <Container maxWidth="xl" component="main">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2" component="h1">
          Versicherungs-Helfer
        </Typography>
        {!errorMessage && <Chat flow={flow} selectOption={selectOption} />}
        {requestState.isSuccess && (
          <Typography variant="h3">
            Herzlichen Dank für Ihre Angaben!
          </Typography>
        )}
      </Box>
    </Container>
  );
};
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: await fetchFlowData(),
  };
};
export default Home;
