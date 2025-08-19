import jwt from "jsonwebtoken";
import { IUserToken } from "./interfaces";
import { JWT_SECRET } from "./env";

const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const getUserData = (token: string) => {
  const user = jwt.verify(token, JWT_SECRET) as IUserToken;
  return user;
};

export { generateToken, getUserData };
