import * as yup from "yup";
import { validateDate } from "../utils/date";

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
        return validateDate(value);
      }),
    phone_number: yup.string().required("Nomor telepon harus diisi"),
    NIM: yup.string().required("Nomor Induk Mahasiswa harus diisi"),
    faculty: yup.string().required("Fakultas harus diisi"),
    major: yup.string().required("Jurusan harus diisi"),
    payment_date: yup.string().required("Tanggal pembayaran harus diisi").test("valid-date", (value) => {
      if (!value) return false;
      return validateDate(value);
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
        return validateDate(value);
      }),
    quota: yup.number(),
  }),
};

export { serviceValidation, scheduleValidation };
