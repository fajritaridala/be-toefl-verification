import { Response } from "express";
import mongoose from "mongoose";
import * as Yup from "yup";

type ErrorParams = {
  res: Response;
  message: string | Error;
  error?: unknown;
  data?: any;
  needsRegistration?: boolean;
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
  success: (res: Response, data: any, message: string) => {
    return res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data,
    });
  },
  error: (params: ErrorParams) => {
    const { res, error, message, data = null, needsRegistration } = params;

    // error dari registrasi akun
    if (needsRegistration) {
      res.status(400).json({
        meta: {
          status: 400,
          message,
          needsRegistration,
        },
        data,
      });
    }

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
      const _err = error as any;
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
      data,
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
