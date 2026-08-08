import { NextFunction, Request, Response } from 'express';

import { NotFoundError, ConflictError } from '../shared/errors/app-errors';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: err.message,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      error: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    error: 'Internal Server Error',
  });
}
