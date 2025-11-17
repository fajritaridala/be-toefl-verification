import mongoose from "mongoose";
import * as yup from "yup";
import { REGISTER_STATUS } from "../utils/constants";
import time from "../utils/date";

// service validation
const serviceValidation = {
  create: yup.object({
    name: yup.string().required("Nama layanan harus diisi"),
    description: yup.string().required("Deskripsi layanan harus diisi"),
    price: yup.number().required("Harga layanan harus diisi"),
    duration: yup.number().required("Durasi layanan harus diisi"),
    notes: yup.string(),
  }),
  update: yup.object({
    name: yup.string(),
    description: yup.string(),
    price: yup.number(),
    duration: yup.number(),
    notes: yup.string(),
  }),
  register: yup.object({
    fullName: yup.string().required("Nama lengkap harus diisi"),
    gender: yup.string().required("Jenis kelamin harus diisi"),
    birth_date: yup
      .string()
      .required("Tanggal lahir harus diisi")
      .test("valid-date", (value) => {
        if (!value) return false;
        return time.validate(value);
      }),
    phone_number: yup.string().required("Nomor telepon harus diisi"),
    NIM: yup.string().required("Nomor Induk Mahasiswa harus diisi"),
    faculty: yup.string().required("Fakultas harus diisi"),
    major: yup.string().required("Jurusan harus diisi"),
    payment_date: yup
      .string()
      .required("Tanggal pembayaran harus diisi")
      .test("valid-date", (value) => {
        if (!value) return false;
        return time.validate(value);
      }),
  }),
};

// schedule validation
const scheduleValidation = {
  create: yup.object({
    service_id: yup.string().required("Kode layanan harus diisi"),
    schedule_date: yup
      .string()
      .required("Tanggal jadwal harus diisi")
      .test("valid-date", (value) => {
        if (!value) return false;
        return time.validate(value);
      }),
    quota: yup.number(),
  }),
  findAll: yup.object({
    id: yup.string(),
    service_id: yup.string(),
  }),
  registrants: yup.object({
    page: yup
      .number()
      .transform((value, originalValue) => {
        const parsed = Number(originalValue);
        return Number.isNaN(parsed) ? undefined : parsed;
      })
      .default(1)
      .min(1, "Page minimal 1"),
    limit: yup
      .number()
      .transform((value, originalValue) => {
        const parsed = Number(originalValue);
        return Number.isNaN(parsed) ? undefined : parsed;
      })
      .default(10)
      .min(1, "Limit minimal 1"),
    status: yup
      .string()
      .oneOf(Object.values(REGISTER_STATUS))
      .optional(),
    search: yup.string().optional(),
  }),
  scoreParams: yup.object({
    schedule_id: yup
      .string()
      .required("Schedule id harus diisi")
      .test("valid-object-id", "Schedule id tidak valid", (value) =>
        value ? mongoose.Types.ObjectId.isValid(value) : false,
      ),
    participant_id: yup
      .string()
      .required("Participant id harus diisi")
      .test("valid-object-id", "Participant id tidak valid", (value) =>
        value ? mongoose.Types.ObjectId.isValid(value) : false,
      ),
  }),
  scoreInput: yup.object({
    listening: yup
      .number()
      .typeError("Listening harus berupa angka")
      .required("Listening harus diisi"),
    reading: yup
      .number()
      .typeError("Reading harus berupa angka")
      .required("Reading harus diisi"),
    writing: yup
      .number()
      .typeError("Writing harus berupa angka")
      .required("Writing harus diisi"),
  }),
};

export { serviceValidation, scheduleValidation };
