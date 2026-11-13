export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string | number;
    details: ErrorDetail[];
  };
  timestamp: string;
}
