import { NextFunction, Request, Response } from "express";
import { IReqUser } from "../interfaces/auth.interface";

export default (req:Request, res:Response, next:NextFunction) => {
  const tokenJwt = req.headers?.authorization;
}