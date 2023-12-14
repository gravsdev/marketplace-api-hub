import { Router } from "express";

import category from "./category.js";
import image from "./image.js";
import product from "./product.js";
import user from "./user.js";

const router = Router();

router.use("/rest/category", category);
router.use("/rest/image", image);
router.use("/rest/product", product);
router.use("/rest/user", user);

export { router };
