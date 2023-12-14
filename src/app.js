import express from "express";
import cors from "cors";

import { router } from "./routes/index.js";
import { MiddleError } from "./middleware/index.js";
import { env } from "./config/index.js";

const app = express();

app.use(
  cors({
    origin: env.server.origins,
    methods: env.server.methods,
    allowedHeaders: env.server.headers,
  })
);
app.use(express.json());
app.use(router);
app.use(MiddleError.unknownEndpoint);
app.use(MiddleError.handleError);

export default app;
