export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  static badRequest(message: string, details?: unknown): HttpError {
    return new HttpError(400, message, details);
  }

  static unauthorized(message = "Unauthorized"): HttpError {
    return new HttpError(401, message);
  }

  static forbidden(message = "Forbidden"): HttpError {
    return new HttpError(403, message);
  }

  static notFound(message = "Not found"): HttpError {
    return new HttpError(404, message);
  }

  static internal(message = "Internal server error"): HttpError {
    return new HttpError(500, message);
  }
}
