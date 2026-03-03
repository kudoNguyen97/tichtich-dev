export const ERROR_CODE_I18N: Record<number, string> = {
    // Auth
    1001: 'error.auth.invalidCredentials',
    1002: 'error.auth.tokenExpired',
    1003: 'error.auth.accountLocked',

    // Validation
    2001: 'error.validation.invalidInput',
    2002: 'error.validation.required',

    // Permission
    3001: 'error.permission.denied',

    // Resource
    4001: 'error.resource.notFound',
    4002: 'error.resource.alreadyExists',
};
