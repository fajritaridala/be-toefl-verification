import * as Yup from 'yup';
import { STATUS } from './constant';

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
  address: Yup.string().required(),
  fullName: Yup.string().required(),
  email: Yup.string().email().required(),
  nim: Yup.string().required(),
  major: Yup.string().required(),
  dateTest: Yup.date()
    .default(() => new Date())
    .required(),
  sessionTest: Yup.number().required(),
  listening: Yup.number().required(),
  reading: Yup.number().required(),
  writing: Yup.number().required(),
});

const toeflValidateSchema = Yup.object({
  address: Yup.string().required(),
  fullName: Yup.string().required(),
  email: Yup.string().email().required(),
  nim: Yup.string().required(),
  major: Yup.string().required(),
  sessionTest: Yup.string().required(),
  testDate: Yup.date().default(new Date()).required(),
  status: Yup.string().default(STATUS.BELUM_SELESAI).required(),
});

export {
  registerValidateSchema,
  loginValidateSchema,
  toeflValidateSchema,
  inputValidateSchema,
};
