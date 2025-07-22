import * as Yup from 'yup';

// register schema
export const registerValidateSchema = Yup.object({
  address: Yup.string().required(),
  fullName: Yup.string().required(),
  email: Yup.string().email().required(),
  role: Yup.string().oneOf(['peserta', 'admin']).default('peserta'),
})