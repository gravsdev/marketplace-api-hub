import multer from "multer";
import { Router } from "express";
import { ImageController } from "../controller/index.js";
import { MiddleAuth } from "../middleware/index.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.patch(
  "/upload/profile/photo/:id",
  MiddleAuth.verifyToken,
  MiddleAuth.verifyAccountOwnership,
  upload.single("profile-photo"),
  ImageController.uploadProfilePhoto
);

export default router;
