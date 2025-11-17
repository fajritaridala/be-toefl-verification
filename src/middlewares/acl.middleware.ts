import { NextFunction, Response } from "express";
import { IReqUser } from "../interfaces/auth.interface";

const aclMiddleware = (roles: string[]) => {
  return (req: IReqUser, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      console.log("Error in acl middleware");
      console.log(req.user);
      return res.status(403).json({
        data: null,
        message: "Forbidden",
      });
    }

    next();
  };
};

export default aclMiddleware;
