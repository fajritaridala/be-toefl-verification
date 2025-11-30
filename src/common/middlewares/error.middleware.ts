import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import * as yup from "yup";
import { ErrorDto } from "../dtos/error.dto";

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error Log:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Terjadi kesalahan internal pada server";
  let data: any = null;

  // YUP Validation Error
  if (err instanceof yup.ValidationError) {
    statusCode = 400;
    message = "Validasi Gagal";
    data = err.inner.length
      ? err.inner.map((e) => ({
          field: e.path,
          message: e.message,
        }))
      : [{ field: err.path, message: err.message }];
  }

  // Mongoose Duplicate Key (E11000)
  else if (err.code === 11000) {
    statusCode = 409;
    // Ambil nama field yang duplikat
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "Data";
    message = `${field} sudah terdaftar, harap gunakan yang lain.`;
  }

  // Mongoose CastError (ID tidak valid)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Format ID tidak valid: ${err.value}`;
  }

  // Mongoose Validation Error (Schema validation)
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Gagal memproses data";
    data = Object.values(err.errors).map((val: any) => val.message);
  }

  // Error Manual (Generic Error)
  else {
    if (statusCode === 500 && process.env.NODE_ENV === "production") {
      message = "Terjadi kesalahan internal pada server"; // Sembunyikan pesan asli di production
    } else {
      message = err.message; // Tampilkan pesan asli (seperti "Gagal: data tidak ditemukan")
    }

    if (process.env.NODE_ENV === "development") {
      data = err.stack; // Berguna untuk debug
    }
  }

  const responsePayload: ErrorDto = {
    meta: {
      status: statusCode,
      message,
    },
    data,
  };

  return res.status(statusCode).json(responsePayload);
};

export default errorHandler;
