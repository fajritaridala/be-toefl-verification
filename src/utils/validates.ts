import * as Yup from "yup";
import { STATUS } from "./constant";

// register schema
const registerValidateSchema = Yup.object({
  address: Yup.string().required(),
  fullName: Yup.string().required(),
  email: Yup.string().email().required(),
  roleToken: Yup.string().notRequired(),
});

const loginValidateSchema = Yup.object({
  address: Yup.string().required(),
});

const inputValidateSchema = Yup.object({
  address_peserta: Yup.string().required(),
  nama_lengkap: Yup.string().required(),
  email: Yup.string().email().required(),
  nomor_induk_mahasiswa: Yup.string().required(),
  jurusan: Yup.string().required(),
  status: Yup.string().required(),
  sesi_tes: Yup.string().required(),
  tanggal_tes: Yup.date()
    .default(() => new Date())
    .required(),
  nilai_listening: Yup.number().required(),
  nilai_reading: Yup.number().required(),
  nilai_structure: Yup.number().required(),
  nilai_total: Yup.number().required(),
});

const toeflValidateSchema = Yup.object({
  address_peserta: Yup.string().required(),
  nama_lengkap: Yup.string().required(),
  email: Yup.string().email().required(),
  nomor_induk_mahasiswa: Yup.string().required(),
  jurusan: Yup.string().required(),
  sesi_tes: Yup.string().required(),
  tanggal_tes: Yup.date().default(new Date()).required(),
  status: Yup.string().default(STATUS.BELUM_SELESAI).required(),
});

export {
  registerValidateSchema,
  loginValidateSchema,
  toeflValidateSchema,
  inputValidateSchema,
};
