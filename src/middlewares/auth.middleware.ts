import { NextFunction, Request, Response } from "express";
import { IReqUser } from "../utils/interface";
import { getUserData } from "../utils/jwt";
import response from "../utils/response";

export default (req: Request, res: Response, next: NextFunction) => {
  // Cek apakah ada token di header Authorization
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return response.unauthorized(res);
  }

  // membaca token
  const [prefix, accessToken] = authorization.split(" "); // @split(" ") untuk memisahkan prefix "Bearer" dan token

  if (!(prefix === "Bearer" && accessToken)) {
    return response.unauthorized(res);
  }

  const user = getUserData(accessToken);

  if (!user) {
    return response.unauthorized(res);
  }

  // tambahkan user ke request
  (req as IReqUser).user = user;

  next();
};
