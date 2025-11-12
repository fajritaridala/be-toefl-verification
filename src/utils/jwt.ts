import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./env";
import { IUserToken } from "./interface";

const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const getUserData = (token: string) => {
  const user = jwt.verify(token, JWT_SECRET) as IUserToken;
  return user;
};

export { generateToken, getUserData };
