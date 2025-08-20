import { Response } from "express";

interface TMeta {
  total: number;
}

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
}

const sendResponse = <T> (res: Response, payload: IResponse<T>) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    meta: payload.meta,f
  });
};

export default sendResponse;
