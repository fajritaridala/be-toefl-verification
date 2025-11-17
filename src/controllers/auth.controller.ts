import { Request, Response } from "express";
import { IReqUser } from "../interfaces/auth.interface";
import { UserModel } from "../models/user.model";
import { ROLES } from "../utils/constants";
import { generateToken } from "../utils/jwt";
import response from "../utils/response";
import { loginValidateSchema, registerValidateSchema } from "../utils/validate";

export default {
  async loginUser(req: Request, res: Response) {
    try {
      const body = await loginValidateSchema.validate(req.body);
      const { address } = body;

      const user = await UserModel.findOne({ address });
      if (!user) {
        return response.success(res, address, "Address tidak ditemukan", true);
      }

      const jwt = generateToken({
        _id: user._id,
        address: user.address,
        role: user.role,
      });

      response.success(res, jwt, "Login berhasil");
    } catch (error) {
      response.error(res, error, "Login gagal");
    }
  },

  async registerUser(req: Request, res: Response) {
    try {
      const body = await registerValidateSchema.validate(req.body);
      const { address, username, email, roleToken } = body;

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
        username,
        email,
        role,
      });

      const result = {
        address: user.address,
        username: user.username,
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

  async getProfile(req: IReqUser, res: Response) {
    try {
      const address = req.user?.address;
      const user = await UserModel.findOne({ address }).lean();
      if (!user) throw new Error("Pengguna tidak ditemukan");

      const result = {
        address: user.address,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      response.success(res, result, "Data pengguna berhasil diperoleh");
    } catch (error) {
      response.error(res, error, "Gagal memperoleh data pengguna");
    }
  },
};
