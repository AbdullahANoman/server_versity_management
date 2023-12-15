/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorHandling } from './../interface/error';

const handleDuplicateError = (err: any): TGenericErrorHandling => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];
  const errorSources: TErrorSources = [
    {
      path: '',
      message: extractedMessage,
    },
  ];
  const message = 'Duplicate Error';
  const statusCode = 400;

  return {
    message,
    statusCode,
    errorSources,
  };
};

export default handleDuplicateError;
