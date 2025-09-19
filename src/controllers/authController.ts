import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { ROLES } from "../utils/constant";
import { IReqUser } from "../utils/interfaces";
import { loginValidateSchema, registerValidateSchema } from "../utils/validates";

type TLogin = {
  address: string;
};

type TRegister = {
  address: string;
  fullName: string;
  email: string;
  roleToken?: string;
};

export default {
  async login(req: Request, res: Response) {
    try {
      const { address } = req.body as unknown as TLogin;

      await loginValidateSchema.validate({ address });

      const existingUser = await UserModel.findOne({ address });
      console.log(existingUser);

      if (existingUser) {
        const tokenJwt = generateToken({
          address: existingUser.address,
          role: existingUser.role,
        });

        res.status(200).json({
          message: "login successful",
          data: {
            user: tokenJwt,
          },
        });
      } else {
        res.status(200).json({
          message: "address not registered",
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
      const { address, fullName, email, roleToken } =
        req.body as unknown as TRegister;

      await registerValidateSchema.validate({
        address,
        fullName,
        email,
        roleToken,
      });

      const existingAddress = await UserModel.findOne({ address });
      if (existingAddress) {
        throw new Error("address already registered");
      }
      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        throw new Error("email already registered");
      }

      // validasi role
      let role = ROLES.PESERTA;
      if (roleToken === process.env.ADMIN_TOKEN) {
        role = ROLES.ADMIN;
      }

      const result = await UserModel.create({
        address,
        fullName,
        email,
        role,
      });

      res.status(201).json({
        message: "registration successful",
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

  async me(req: IReqUser, res: Response) {
    try {
      const address = req.user?.address;
      const result = await UserModel.findOne({ address }).lean();

      res.status(200).json({
        message: "data successfully received",
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
