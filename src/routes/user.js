import { Router } from "express";

import { UserController } from "../controller/index.js";
import { MiddleAuth } from "../middleware/index.js";

const router = Router();

// administrador
router.get(
  "/",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyIfAccountIsAdmin,
  UserController.users
);

// privadas
router.put(
  "/:id",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyAccountOwnership,
  UserController.editProfile
);
router.get(
  "/:id",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyAccountOwnership,
  UserController.user
);

// publicas
router.post("/sign-up", UserController.signUp);
router.post("/sign-in", UserController.signIn);

export default router;
