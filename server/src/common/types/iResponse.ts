export class IResponse<T extends {}> {
    code: number;
    isValidate?: boolean;
    errors?: Array<{
        fieldError: string;
        message: string;
    }>;
    success: boolean;
    valuesError?: string[]
    accessToken?: string;
    refreshToken?: string;
    data?: T;
    message?: string;
    fieldError?: string;
}
