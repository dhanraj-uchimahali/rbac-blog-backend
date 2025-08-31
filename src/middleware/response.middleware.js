import db from "../models/mysql/index.js";
import endpointToActionMap from "../constants/endPointActionMap.js";
import { match } from "path-to-regexp";

const getClientIp = (req) => {
  let ip = req.headers["x-forwarded-for"]?.split(",").shift() || req.ip;

  if (!ip) return null;

  // Handle IPv6 localhost (::1)
  if (ip === "::1") return "127.0.0.1";

  // Handle IPv6-mapped IPv4 (::ffff:127.0.0.1)
  if (ip.startsWith("::ffff:")) return ip.substring(7);

  return ip;
};

const insertAuditLog = async (req, parsedRequest, action, statusCode, parsedResponse) => {
  await db.AuditLogs.create({
    user_id: req?.userId || null,
    action: action,
    method: req.method,
    request: parsedRequest,
    response: parsedResponse,
    status_code: statusCode,
    ip_address: getClientIp(req),
  });
};

export const responseMiddleware = (req, res, next) => {
  let action = "";
  for (const data of endpointToActionMap) {
    const matcher = match(data.endpoint, { decode: decodeURIComponent }); // create matcher
    const matched = matcher(req.originalUrl); // test the url
    if (matched && data.method === req.method) {
      action = data.action || "";
      break;
    }
  }

  const parsedRequest = {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    headers: req.headers,
    body: req.body,
    queryParams: req.query || "",
  };

  let parsedResponse = {};

  // Success response handler
  res.success = async (data, message = "Success", statusCode = 200) => {
    parsedResponse = {
      status: statusCode,
      message: message,
      result: res.data ? JSON.stringify(res.data).replaceAll("'", "") : "",
    };
    await insertAuditLog(req, parsedRequest, action, statusCode, parsedResponse);
    return res.status(statusCode).json({
      success: true,
      message: message,
      result: data,
    });
  };

  // Error response handler
  res.error = async (message = 'Error', statusCode = 500, errors = null) => {
    parsedResponse = {
      status: statusCode,
      message: message,
      result: res.data ? JSON.stringify(res.data).replaceAll("'", "") : "",
    };
    await insertAuditLog(req, parsedRequest, action, statusCode, parsedResponse);
    return res.status(statusCode).json({
      success: false,
      message: message
    });
  };

  next();
};
