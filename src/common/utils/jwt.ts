import { sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import { UserToken } from "../../modules/auth/auth.interface";

const jwt = {
  generateToken: (payload: UserToken) => {
    const token = sign(payload, JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  },
  getUser: (token: string) => {
    const user = verify(token, JWT_SECRET) as UserToken;
    return user;
  },
};

export default jwt;
