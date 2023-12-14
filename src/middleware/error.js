import { NotFound } from "../utils/error.js";

function handleError(error, req, res, next) {
  console.log(error);

  res.status(error.status || 500).send({
    errors: [{ code: error.code, message: error.message }],
  });

  next();
}

function unknownEndpoint(req, res) {
  throw new NotFound(`Unknown endpoint ${req.method} ${req.url}`);
}

export default { handleError, unknownEndpoint };
