export type ApiResponse<T> = {
    data: T;
};

export type ApiError = {
    message: string;
    code?: string;
};

export type ErrorResponse = {
    error: ApiError;
};
