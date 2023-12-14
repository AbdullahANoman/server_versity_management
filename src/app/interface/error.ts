export type TErrorSources = {
  path: number | string;
  message: string;
}[];

export type TGenericErrorHandling = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
