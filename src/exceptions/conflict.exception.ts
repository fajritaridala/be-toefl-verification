import { ERROR_CODES } from "../constants";
import { BaseException } from "./base.exception";

export class ConflictException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(message, 409, ERROR_CODES.CONFLICT, details);
  }
}
