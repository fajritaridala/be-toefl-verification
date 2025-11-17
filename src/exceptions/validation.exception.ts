import { ERROR_CODES } from "../constants";
import { BaseException } from "./base.exception";

export class ValidationException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(message, 400, ERROR_CODES.VALIDATION_ERROR, details);
  }
}
