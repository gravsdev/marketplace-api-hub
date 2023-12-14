import { Router } from "express";

import { CategoryController } from "../controller/index.js";
import { MiddleAuth } from "../middleware/index.js";

const router = Router();

// administrador
router.post(
  "/",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyIfAccountIsAdmin,
  CategoryController.create
);
router.put(
  "/:id",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyIfAccountIsAdmin,
  CategoryController.update
);
router.delete(
  "/:id",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyIfAccountIsAdmin,
  CategoryController.remove
);

// publicas
router.get("/", CategoryController.categories);
router.get("/:id", CategoryController.category);

export default router;
