export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
