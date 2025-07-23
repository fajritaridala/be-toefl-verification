import * as Yup from "yup";
import { ROLES } from "../utils/contant";

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

export { registerValidateSchema, loginValidateSchema };
