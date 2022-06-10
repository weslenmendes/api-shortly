import { stripHtml } from "string-strip-html";

export function sanitizeSignUpBody(body) {
  const sanitizedBody = {
    name: stripHtml(String(body.name) || "<br/>").result,
    email: stripHtml(String(body.email) || "<br/>").result,
    password: stripHtml(String(body.password) || "<br/>").result,
    confirmPassword: stripHtml(String(body.confirmPassword) || "<br/>").result,
  };

  return sanitizedBody;
}

export function sanitizeSignInBody(body) {
  const sanitizedBody = {
    email: stripHtml(String(body.email) || "<br/>").result,
    password: stripHtml(String(body.password) || "<br/>").result,
  };

  return sanitizedBody;
}
