import { ERROR_CODES } from "../constants";
import { BaseException } from "./base.exception";

export class NotFoundException extends BaseException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, ERROR_CODES.NOT_FOUND);
  }
}
