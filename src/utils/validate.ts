import * as Yup from "yup";
import { validateDate } from "./date";

// register schema
const registerValidateSchema = Yup.object({
  address: Yup.string().required(),
  username: Yup.string().required(),
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
  jenis_tes: Yup.string().required("Jenis Tes harus diisi"),
  nama_lengkap: Yup.string().required("Nama Lengkap harus diisi"),
  jenis_kelamin: Yup.string().required("Jenis kelamin harus diisi"),
  tanggal_lahir: Yup.string()
    .required("Tanggal lahir harus diisi")
    .test("is-date-valid", (value) => {
      if (!value) return true;
      return validateDate(value);
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
  addScheduleValidateSchema,
  addLayananValidateSchema,
};

const addLayananValidateSchema = Yup.object({
  nama_layanan: Yup.string().required("Nama layanan harus diisi"),
  deskripsi: Yup.string().required("Deskripsi harus diisi"),
  harga: Yup.number().required("Harga harus diisi"),
  durasi: Yup.number().required("Durasi harus diisi"),
});

const addScheduleValidateSchema = Yup.object({
  tanggal_tes: Yup.date().required("Tanggal tes harus diisi"),
  waktu_mulai: Yup.date().required("Waktu mulai harus diisi"),
  waktu_selesai: Yup.date().required("Waktu selesai harus diisi"),
  lokasi: Yup.string().required("Lokasi harus diisi"),
  kuota_penuh: Yup.number().required("Kuota penuh harus diisi"),
});
