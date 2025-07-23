import * as Yup from "yup";

// register schema
const registerValidateSchema = Yup.object({
  address: Yup.string().required(),
  fullName: Yup.string().required(),
  email: Yup.string().email().required(),
  role: Yup.string().oneOf(["peserta", "admin"]).default("peserta"),
});

const loginValidateSchema = Yup.object({
  address: Yup.string().required(),
});

export { registerValidateSchema, loginValidateSchema };
