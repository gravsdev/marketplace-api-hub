import { Router } from "express";

import { ProductController } from "../controller/index.js";
import { MiddleAuth } from "../middleware/index.js";

const router = Router();

// administrador
router.post(
  "/",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyIfAccountIsAdmin,
  ProductController.create
);
router.put(
  "/:id",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyIfAccountIsAdmin,
  ProductController.update
);
router.delete(
  "/:id",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyIfAccountIsAdmin,
  ProductController.remove
);

// publicas
router.get("/", ProductController.products);
router.get("/:id", ProductController.product);

export default router;
