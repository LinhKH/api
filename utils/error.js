export const handleError = (statusCode, message) => {
  const error = new Error(err);
  error.statusCode = statusCode;
  error.message = message;
  return error;
};