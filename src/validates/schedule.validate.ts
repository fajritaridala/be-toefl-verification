import mongoose from "mongoose";
import * as yup from "yup";
import { REGISTER_STATUS } from "../utils/constants";
import time from "../utils/date";

// service validation
const numberTransform = (value: unknown, originalValue: unknown) => {
  const parsed = Number(originalValue);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const serviceValidation = {
  create: yup.object({
    name: yup.string().required("Service name is required"),
    description: yup.string().required("Description is required"),
    price: yup.number().required("Price is required"),
    duration: yup.number().required("Duration is required"),
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
    fullName: yup.string().required("Full name is required"),
    gender: yup.string().required("Gender is required"),
    birth_date: yup
      .string()
      .required("Birth date is required")
      .test("valid-date", (value) => {
        if (!value) return false;
        return time.validate(value);
      }),
    phone_number: yup.string().required("Phone number is required"),
    NIM: yup.string().required("Student number is required"),
    faculty: yup.string().required("Faculty is required"),
    major: yup.string().required("Major is required"),
    payment_date: yup
      .string()
      .required("Payment date is required")
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
      .transform(numberTransform)
      .default(1)
      .min(1, "Page must be at least 1"),
    limit: yup
      .number()
      .transform(numberTransform)
      .default(10)
      .min(1, "Limit must be at least 1"),
    status: yup.string().oneOf(Object.values(REGISTER_STATUS)).optional(),
    search: yup.string().optional(),
    sort: yup
      .mixed<"newest" | "oldest">()
      .oneOf(["newest", "oldest"])
      .optional(),
  }),
  participants: yup.object({
    page: yup
      .number()
      .transform(numberTransform)
      .default(1)
      .min(1, "Page must be at least 1"),
    limit: yup
      .number()
      .transform(numberTransform)
      .default(10)
      .min(1, "Limit must be at least 1"),
    status: yup.string().oneOf(Object.values(REGISTER_STATUS)).optional(),
    search: yup.string().optional(),
    sort: yup
      .mixed<"newest" | "oldest">()
      .oneOf(["newest", "oldest"])
      .optional(),
  }),
  scoreParams: yup.object({
    scheduleId: yup
      .string()
      .required("Schedule id is required")
      .test("valid-object-id", "Schedule id is not valid", (value) =>
        value ? mongoose.Types.ObjectId.isValid(value) : false,
      ),
    participantId: yup
      .string()
      .required("Participant id is required")
      .test("valid-object-id", "Participant id is not valid", (value) =>
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
