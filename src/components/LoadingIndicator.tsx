import { LinearProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';

type Props = {
  isLoading: boolean;
};
export const LoadingIndicator = ({ isLoading }: Props): JSX.Element | null => {
  return isLoading ? (
    <Box sx={{ width: 'max-content' }}>
      <Typography variant="h3">Sende Daten...</Typography>
      <LinearProgress />
    </Box>
  ) : null;
};
