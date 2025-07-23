import { Request, Response } from "express";
import { TRegister, TLogin } from "../types/auth.types";
import {
  registerValidateSchema,
  loginValidateSchema,
} from "../schemas/auth.schema";
import { UserModel } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { ROLES } from "../utils/contant";

export default {
  async login(req: Request, res: Response) {
    try {
      const { address } = req.body as unknown as TLogin;

      await loginValidateSchema.validate({ address });

      const existingUser = await UserModel.findOne({ address });

      if (existingUser) {
        const tokenJwt = generateToken({
          id: existingUser._id,
          address: existingUser.address,
          fullName: existingUser.fullName,
          email: existingUser.email,
          role: existingUser.role,
        });

        res.status(200).json({
          message: "Login successful",
          data: {
            user: tokenJwt,
          },
        });
      } else {
        return res.status(404).json({
          message: "Address not registered",
          needsRegistration: true,
          data: { address },
        });
      }
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const {
        address,
        fullName,
        email,
        roleToken,
      } = req.body as unknown as TRegister;

      await registerValidateSchema.validate({
        address,
        fullName,
        email,
        roleToken,
      });

      // validasi role
      let role = ROLES.PESERTA;
      if (roleToken == process.env.ADMIN_TOKEN) {
        role = ROLES.ADMIN;
      }

      const result = await UserModel.create({
        address,
        fullName,
        email,
        role,
      });

      res.status(200).json({
        message: "Registration successful",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
