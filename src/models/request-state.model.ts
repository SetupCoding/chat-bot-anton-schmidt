export type Request = {
  isSuccess: boolean;
  error?: Error;
  isLoading?: boolean;
  sendPUTRequest: () => void;
};
