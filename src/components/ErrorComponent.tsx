import { Button, Typography } from '@mui/material';

type Props = {
  error?: Error | string | undefined;
  retryCallback?: () => void;
};

export const ErrorComponent = ({
  error,
  retryCallback,
}: Props): JSX.Element | null => {
  return error ? (
    <>
      <Typography variant="h3" color="error">{`Ein Fehler ist aufgetreten.${
        retryCallback
          ? ''
          : ' Bitte versuchen Sie es in ein paar Minuten erneut.'
      }`}</Typography>
      {retryCallback && (
        <Button
          variant="contained"
          color="error"
          onClick={() => retryCallback()}
          sx={{ my: 4, padding: 2 }}
        >
          Erneut absenden
        </Button>
      )}
    </>
  ) : null;
};
