import jwt from "jsonwebtoken";
import { env } from "../config/index.js";
import { ErrorMessage, Forbidden, Unauthorized } from "../utils/error.js";
import { checkIfIdIsValid } from "../utils/valid.js";

function verifyToken(req, res, next) {
  try {
    const sessionToken = req.headers.authorization || "";
    const token = sessionToken.startsWith("Bearer ")
      ? sessionToken.slice(7)
      : sessionToken;

    const credentials = jwt.verify(token, env.token.authorization);

    req.user = credentials;
    next();
  } catch (error) {
    throw new Unauthorized(ErrorMessage.TOKEN_INVALID);
  }
}

function verifyAccountOwnership(req, res, next) {
  try {
    checkIfIdIsValid(req.params.id, "user");

    if (req.params.id && req.params.id !== req.user.userId) {
      throw new Unauthorized(ErrorMessage.WRONG_ACCOUNT_OWNERSHIP);
    }

    next();
  } catch (error) {
    throw error;
  }
}

function verifyIfAccountIsAdmin(req, res, next) {
  try {
    if (!req.user.isOwner) {
      throw new Forbidden(ErrorMessage.NOT_ADMIN);
    }

    next();
  } catch (error) {
    throw error;
  }
}

export default {
  verifyToken,
  verifyAccountOwnership,
  verifyIfAccountIsAdmin,
};
