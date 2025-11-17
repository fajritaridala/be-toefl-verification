import { ERROR_CODES } from "../constants";
import { BaseException } from "./base.exception";

export class AuthenticationException extends BaseException {
  constructor(message: string = "Authentication failed") {
    super(message, 401, ERROR_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string = "Access forbidden") {
    super(message, 403, ERROR_CODES.FORBIDDEN);
  }
}
