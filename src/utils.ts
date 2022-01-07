/**
 * Generates a Swagger schema for exceptions
 * 
 * @param   statusCode  Example status code
 * @param   message     Example message
 * @param   error       Example error description
 * @returns             Schema used by Swagger docs
 */
 export const generateExceptionSchema = (
  statusCode: number,
  message: string,
  error: string | string[]
) => ({
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      description: 'The status code of the error.',
      example: statusCode,
    },
    message: {
      type: 'string',
      description: 'A brief description of the error.',
      example: message,
    },
    error: {
      type: 'string | [string]',
      description:
        'Another description of the error, possibly more detailed than `message`.',
      example: error,
    },
  },
});