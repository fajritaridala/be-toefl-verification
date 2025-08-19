import { NextFunction, Request, Response } from "express";
import { IReqUser } from "../utils/interfaces";
import { getUserData } from "../utils/jwt";

export default (req:Request, res:Response, next:NextFunction) => {
  // Cek apakah ada token di header Authorization
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return res.status(403).json({
      message: "unauthorized",
      data: null,
    })
  }

  // membaca token
  const [prefix, accessToken] = authorization.split(" "); // @split(" ") untuk memisahkan prefix "Bearer" dan token

  if (!(prefix === "Bearer" && accessToken)) {
    return res.status(403).json({
      message: "unauthorized",
      data: null,
    });
  }

  const user = getUserData(accessToken);

  if (!user) {
    return res.status(403).json({
      message: "unauthorized",
      data: null,
    });
  }

  // tambahkan user ke request
  (req as IReqUser).user = user;

  next();
}