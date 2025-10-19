import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { ROLES } from "../utils/constants";
import { IReqUser } from "../utils/interface";
import { generateToken } from "../utils/jwt";
import response from "../utils/response";
import {
  loginValidateSchema,
  registerValidateSchema,
} from "../utils/validate";

type TLogin = {
  address: string;
};

type TRegister = TLogin & {
  fullName: string;
  email: string;
  roleToken?: string;
};

export default {
  async login(req: Request, res: Response) {
    try {
      const body = await loginValidateSchema.validate(req.body as TLogin);
      const { address } = body;

      const user = await UserModel.findOne({ address });
      if (!user) {
        return response.error({
          res,
          message: "Address tidak ditemukan",
          needsRegistration: true,
          data: { address },
        });
      }

      const jwt = generateToken({
        address: user.address,
        role: user.role,
      });

      response.success(res, jwt, "Login berhasil");
    } catch (error) {
      response.error({ res, error, message: "Login gagal" });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const body = await registerValidateSchema.validate(req.body as TRegister);
      const { address, fullName, email, roleToken } = body;

      const existingAddress = await UserModel.findOne({ address });
      if (existingAddress) throw new Error("Address telah terdaftar");

      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) throw new Error("Email telah terdaftar");

      // validasi role
      let role = ROLES.PESERTA;
      if (roleToken === process.env.ADMIN_TOKEN) {
        role = ROLES.ADMIN;
      }

      const user = await UserModel.create({
        address,
        fullName,
        email,
        role,
      });

      const result = {
        address: user.address,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      };

      response.success(res, result, "Registrasi berhasil");
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const address = req.user?.address;
      const user = await UserModel.findOne({ address }).lean();
      if (!user) throw new Error("Pengguna tidak ditemukan");

      const result = {
        address: user.address,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      };

      response.success(res, result, "Data pengguna berhasil diperoleh");
    } catch (error) {
      response.error({ res, error, message: "Gagal memperoleh data pengguna" });
    }
  },
};
