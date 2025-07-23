import { Request, Response } from "express";
import { TRegister, TLogin } from "../types/auth.types";
import {
  registerValidateSchema,
  loginValidateSchema,
} from "../schemas/auth.schema";
import { UserModel } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export default {
  async register(req: Request, res: Response) {
    try {
      const {
        address,
        fullName,
        email,
        role = "peserta",
      } = req.body as unknown as TRegister;

      await registerValidateSchema.validate({
        address,
        fullName,
        email,
        role,
      });

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

  async login(req: Request, res: Response) {
    try {
      const { address } = req.body as unknown as TLogin;

      await loginValidateSchema.validate({ address });

      const userByAddress = await UserModel.findOne({ address });
      if (!userByAddress) {
        return res.status(404).json({
          message: "Address not registered",
          needsRegistration: true,
        });
      }

      const tokenJwt = generateToken({
        id: userByAddress._id,
        address: userByAddress.address,
        fullName: userByAddress.fullName,
        email: userByAddress.email,
        role: userByAddress.role,
      })

      res.status(200).json({
        message: "Login successful",
        data: {
          user: tokenJwt,
        },
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
