import { NextFunction, Request, Response } from "express";
import { IReqUser } from "../interfaces/auth.interface";
import { getUserData } from "../utils/jwt";
import response from "../utils/response";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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

const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers?.authorization;
  if (authorization) {
    const [prefix, accessToken] = authorization.split(" ");
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
  } else {
    next();
  }
};

export { authMiddleware, optionalAuthMiddleware };
