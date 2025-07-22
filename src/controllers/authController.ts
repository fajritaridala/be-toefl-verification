import { Request, Response } from "express";
import { TRegister } from "../types/auth.types";
import { registerValidateSchema } from "../schemas/auth.schema";
import { UserModel } from "../models/user.model";

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
};
