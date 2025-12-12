import * as yup from "yup";
import { QueryDto, querySchema } from "../../../common/dtos/query.dto";
import { ENROLLED_STATUS } from "../../../common/utils/constants";

// register
const enrollUserSchema = yup.object().shape({
  participantId: yup.string().required("participantId harus ada"),
});
const registerEnrollParamsSchema = yup.object().shape({
  scheduleId: yup.string().required("scheduleId harus ada"),
});
const registerEnrollSchema = yup.object().shape({
  paymentDate: yup.date().required("tanggal pembayaran harus ada"),
  fullName: yup.string().required("nama lengkap harus ada"),
  birthDate: yup.date().required("tanggal lahir harus ada"),
  gender: yup.string().required("jenis kelamin harus ada"),
  email: yup.string().email().required("email harus ada"),
  phoneNumber: yup.number().required("nomor telepon harus ada"),
  nim: yup.string().required("nim harus ada"),
  faculty: yup.string().required("fakultas harus ada"),
  major: yup.string().required("jurusan harus ada"),
});

type EnrollUserDto = yup.InferType<typeof enrollUserSchema>;
type RegisterEnrollDto = yup.InferType<typeof registerEnrollSchema>;
type RegisterEnrollParamsDto = yup.InferType<typeof registerEnrollParamsSchema>;
type RegisterEnrollOptionsDto = {
  params: RegisterEnrollParamsDto;
  user: EnrollUserDto;
  body: RegisterEnrollDto;
  file: Express.Multer.File;
};

// findAll
const findAllEnrollQuerySchema = querySchema.shape({
  status: yup.string().optional(),
});
type FindAllEnrollQueryDto = yup.InferType<typeof findAllEnrollQuerySchema>;
type FindAllEnrollOptionsDto = Omit<QueryDto, "page"> & {
  skip: number;
  status?: string;
};

// getScheduleParticipants
type GetScheduleEnrollOptionsDto = Omit<QueryDto, "page"> &
  RegisterEnrollParamsDto & {
    skip: number;
  };

// approval
const approvalEnrollSchema = yup.object().shape({
  status: yup
    .string()
    .required("status harus ada")
    .oneOf([ENROLLED_STATUS.APPROVED, ENROLLED_STATUS.REJECTED]),
});
const approvalEnrollParamsSchema = yup.object().shape({
  enrollId: yup.string().required("id enroll harus ada"),
});
type ApprovalEnrolDto = yup.InferType<typeof approvalEnrollSchema>;
type ApprovalEnrolParamsDto = yup.InferType<typeof approvalEnrollParamsSchema>;
type ApprovalEnrollOptionsDto = {
  body: ApprovalEnrolDto;
  params: ApprovalEnrolParamsDto;
};

// submitScore
const submitEnrollSchema = yup.object().shape({
  listening: yup.number().required("nilai listening harus ada"),
  reading: yup.number().required("nilai reading harus ada"),
  structure: yup.number().required("nilai structure harus ada"),
});
const submitEnrollParamsSchema = yup.object().shape({
  enrollId: yup.string().required("id enroll harus ada"),
  participantId: yup.string().required("id participant harus ada"),
});
type SubmitEnrollDto = yup.InferType<typeof submitEnrollSchema>;
type SubmitEnrollParamsDto = yup.InferType<typeof submitEnrollParamsSchema>;
type SubmitEnrollOptionsDto = {
  body: SubmitEnrollDto;
  params: SubmitEnrollParamsDto;
};

// blockchainSuccess
const blockchainParamsSchema = submitEnrollParamsSchema.shape({
  enrollId: yup.string().required("id enroll harus ada"),
});
type BlockchainDto = {
  hash: string;
};
type BlockchainParamsDto = yup.InferType<typeof blockchainParamsSchema>;
type BlockchainOptionsDto = {
  body: BlockchainDto;
  params: BlockchainParamsDto;
};

export {
  approvalEnrollParamsSchema,
  approvalEnrollSchema,
  blockchainParamsSchema,
  enrollUserSchema,
  findAllEnrollQuerySchema,
  registerEnrollParamsSchema,
  registerEnrollSchema,
  submitEnrollParamsSchema,
  submitEnrollSchema,
};
export type {
  ApprovalEnrolDto,
  ApprovalEnrollOptionsDto,
  ApprovalEnrolParamsDto,
  BlockchainDto,
  BlockchainOptionsDto,
  BlockchainParamsDto,
  EnrollUserDto,
  FindAllEnrollOptionsDto,
  FindAllEnrollQueryDto,
  GetScheduleEnrollOptionsDto,
  RegisterEnrollDto,
  RegisterEnrollOptionsDto,
  RegisterEnrollParamsDto,
  SubmitEnrollDto,
  SubmitEnrollOptionsDto,
  SubmitEnrollParamsDto,
};
