import { Box, Container, Typography } from '@mui/material';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Chat, ErrorComponent, LoadingIndicator } from '../components';
import { useSendPut } from '../hooks';
import type { Step } from '../models';
import { fetchFlowData } from '../services';
import { deepCopy, getStepById } from '../utils';

type Props = {
  flowData: Step[];
  errorMessage?: string;
};

export const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ flowData, errorMessage }) => {
  const flowDataMutable = deepCopy<Step[]>(flowData);

  const firstStep = getStepById(100, flowDataMutable) as Step;

  const [flow, setFlow] = useState<Step[]>([firstStep]);
  const [isFlowFinished, setIsFlowFinished] = useState(false);

  const { isSuccess, error, isLoading, sendPUTRequest } = useSendPut(
    flow,
    isFlowFinished
  );

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
      const nextStep = getStepById(nextId, flowDataMutable);

      // update flow if a previous selection was changed
      if (indexToUpdate < updatedState.length - 1) {
        updatedState.length = indexToUpdate + 1;
      }

      // update selected option values
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

  return (
    <>
      <Head>
        <title>Versicherungs-Helfer</title>
        <meta
          name="description"
          content="A chat bot to help you pick an insurance type"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="xl" component="main">
        <Box
          component="section"
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h2">Versicherungs-Helfer</Typography>
          {!errorMessage && (
            <Chat
              flow={flow}
              isFlowFinished={isFlowFinished}
              selectOption={selectOption}
            />
          )}
          <LoadingIndicator isLoading={!!isLoading} />
          {isSuccess && (
            <Typography variant="h3">
              Herzlichen Dank für Ihre Angaben!
            </Typography>
          )}

          <Box sx={{ my: 4, padding: 4 }}>
            <ErrorComponent error={error} retryCallback={sendPUTRequest} />
            <ErrorComponent error={errorMessage} />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: await fetchFlowData(),
  };
};
export default Home;
