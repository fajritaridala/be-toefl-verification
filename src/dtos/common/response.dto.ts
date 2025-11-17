export interface SuccessResponseDto<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponseDto {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponseDto<T> = SuccessResponseDto<T> | ErrorResponseDto;
