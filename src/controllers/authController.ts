import { Request, Response } from "express";
import schema from "../utils/schemas";
import { UserModel } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { ROLES } from "../utils/constant";
import { IReqUser } from "../utils/interfaces";

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

      await schema.login.validate({ address });

      const existingUser = await UserModel.findOne({ address });

      if (existingUser) {
        const tokenJwt = generateToken({
          address: existingUser.address,
          fullName: existingUser.fullName,
          email: existingUser.email,
          role: existingUser.role,
        });

        res.status(200).json({
          message: "login successful",
          data: {
            user: tokenJwt,
          },
        });
      } else {
        return res.status(404).json({
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

      await schema.register.validate({
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
