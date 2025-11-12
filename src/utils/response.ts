import { Response } from "express";
import mongoose from "mongoose";
import * as Yup from "yup";

type ErrorParams = {
  res: Response;
  message: string | Error;
  error: unknown;
};

type TPagination = {
  totalPages: number;
  current: number;
  total: number;
};

type PaginationParams = {
  res: Response;
  data: any[];
  pagination: TPagination;
  message: string;
};

export default {
  success: (
    res: Response,
    data: any,
    message: string,
    needsRegistration?: boolean,
  ) => {
    return res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data,
      needsRegistration,
    });
  },
  error: (res: Response, error: unknown, message: string) => {
    // error dari Yup
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({
        meta: {
          status: 400,
          message,
        },
        data: error.path,
      });
    }

    // error dari mongo
    if (error instanceof mongoose.Error) {
      return res.status(500).json({
        meta: {
          status: 500,
          message,
        },
        data: error.name,
      });
    }

    if ((error as any)?.code) {
      console.log((error as any)?.code);
      const _err = error as any;
      console.log(_err);
      return res.status(500).json({
        meta: {
          status: 500,
          message: _err.errorResponse.message,
        },
        data: _err,
      });
    }

    // default error
    res.status(400).json({
      meta: {
        status: 400,
        message,
      },
      data: null,
    });
  },
  unauthorized: (res: Response, message: string = "Unauthorized") => {
    res.status(403).json({
      meta: {
        status: 403,
        message,
      },
      data: null,
    });
  },
  pagination: (params: PaginationParams) => {
    const { res, data, pagination, message } = params;
    res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data,
      pagination,
    });
  },
};
