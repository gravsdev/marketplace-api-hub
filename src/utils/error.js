function createError(code, status, icon) {
  return class {
    constructor(message) {
      this.code = code;
      this.status = status;
      this.message = `${icon} ${message}`;
    }
  };
}

export const UnexpectedError = createError("INTERNAL_SERVER_ERROR", 500, "🛠️");
export const NotFound = createError("NOT_FOUND", 404, "🕵️");
export const Forbidden = createError("FORBIDDEN", 403, "🔒");
export const Unauthorized = createError("UNAUTHORIZED", 401, "🔑");
export const BadRequest = createError("BAD_REQUEST", 400, "❌");

export const ErrorMessage = {
  REQUIRED_CONSTRAINT: (field) => `Field \"${field}\" is required.`,
  UNIQUE_CONSTRAINT: (field, value) =>
    `The value \"${value}\" of the field \"${field}\" already exists.`,
  CHECK_INT_CONSTRAINT: (field, value) =>
    `The \"${field}\" field must be a positive integer (greater than \"${value}\"). Please provide a valid figure.`,
  NOT_FOUND_FIELD: (model, field, value) =>
    `The \"${model}\" with \"${field}\" \"${value}\" was not found.`,
  INVALID_FIELD: (field, value) =>
    `The \"${field}\" \"${value}\"  is not valid.`,
  TOKEN_INVALID: "The token is not valid.",
  INCORRECT_CREDENTIALS: "Wrong user or password.",
  WRONG_ACCOUNT_OWNERSHIP: "You do not have permission on this account.",
  NOT_ADMIN: "You are not an admin.",
  IMAGE_NOT_PROVIDED: "The image was not provided.",
};
