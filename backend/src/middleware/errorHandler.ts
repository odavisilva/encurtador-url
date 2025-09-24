import type { Request, Response, NextFunction } from 'express';

// Classe base para erros da aplicação
export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requisição inválida') {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito de recursos') {
    super(message, 409);
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ 
      error: err.message,
      status: err.statusCode
    });
  }
  
  if (err.code === 'P2002') {
    return res.status(409).json({ 
      error: 'Recurso já existe',
      status: 409
    });
  }

  res.status(500).json({ 
    error: 'Erro interno do servidor',
    status: 500
  });
}