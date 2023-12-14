import { TErrorSources, TGenericErrorHandling } from './../interface/error';
import { ZodError, ZodIssue } from 'zod';

const handleZodError = (err: ZodError): TGenericErrorHandling => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue?.path.length - 1],
      message: issue?.message,
    };
  });
  const message = err?.message;
  const statusCode = 400;

  return {
    message,
    statusCode,
    errorSources,
  };
};

export default handleZodError;
