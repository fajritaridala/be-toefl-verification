import moment from "moment";
import * as Yup from "yup";
import { STATUS } from "./constants";
import date from "./date";

// register schema
const registerValidateSchema = Yup.object({
  address: Yup.string().required(),
  fullName: Yup.string().required(),
  email: Yup.string().email().required(),
  roleToken: Yup.string().notRequired(),
});

const loginValidateSchema = Yup.object({
  address: Yup.string().required("Address harus diisi"),
});

const inputValidateSchema = Yup.object({
  address_peserta: Yup.string().required(),
  nama_lengkap: Yup.string().required(),
  jenis_kelamin: Yup.string().required(),
  tanggal_lahir: Yup.string().required(),
  nomor_induk_mahasiswa: Yup.string().required(),
  fakultas: Yup.string().required(),
  program_studi: Yup.string().required(),
  sesi_tes: Yup.string().required(),
  tanggal_tes: Yup.string().required(),
  nilai_listening: Yup.number().required(),
  nilai_reading: Yup.number().required(),
  nilai_structure: Yup.number().required(),
  nilai_total: Yup.number().required(),
});

const toeflValidateSchema = Yup.object({
  nama_lengkap: Yup.string().required("Nama Lengkap harus diisi"),
  jenis_kelamin: Yup.string().required("Jenis kelamin harus diisi"),
  tanggal_lahir: Yup.string()
    .required("Tanggal lahir harus diisi")
    .test("is-date-valid", (value) => {
      if (!value) return true;
      return date.isValidDate(value).isValid();
    }),
  nomor_induk_mahasiswa: Yup.string().required(
    "Nomor Induk Mahasiswa harus diisi",
  ),
  fakultas: Yup.string().required("Fakultas harus diisi"),
  program_studi: Yup.string().required("Program Studi harus diisi"),
  sesi_tes: Yup.string().required("Sesi Tes harus diisi"),
});

export {
  registerValidateSchema,
  loginValidateSchema,
  toeflValidateSchema,
  inputValidateSchema,
};
