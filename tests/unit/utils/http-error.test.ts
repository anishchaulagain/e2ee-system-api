import { HttpError } from "../../../src/utils/http-error";

describe("HttpError", () => {
  it("creates a 400 bad request", () => {
    const err = HttpError.badRequest("Invalid input");
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Invalid input");
    expect(err).toBeInstanceOf(HttpError);
  });

  it("creates a 404 not found", () => {
    const err = HttpError.notFound();
    expect(err.statusCode).toBe(404);
  });

  it("creates a 500 internal", () => {
    const err = HttpError.internal();
    expect(err.statusCode).toBe(500);
  });
});
