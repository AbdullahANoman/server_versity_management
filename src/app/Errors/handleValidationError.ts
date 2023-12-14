import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorHandling } from '../interface/error';

const handleValidationError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorHandling => {
  const errorSources: TErrorSources = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const message = error?.message;
  const statusCode = 400;

  return {
    message,
    statusCode,
    errorSources,
  };
};

export default handleValidationError;
