import mongoose from "mongoose";
import { BadRequest, ErrorMessage } from "../utils/error.js";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ErrorMessage.REQUIRED_CONSTRAINT("name")],
    },
    description: { type: String },
    quantity: {
      type: Number,
      default: 0,
      min: [0, ErrorMessage.CHECK_INT_CONSTRAINT("quantity", 0)],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, ErrorMessage.CHECK_INT_CONSTRAINT("price", 0)],
    },
    images: [{ name: { type: String }, path: { type: String } }],
    tags: { type: [String] },
    features: { type: Object },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  },
  { versionKey: false, timestamps: true }
);

ProductSchema.pre("save", async function (next) {
  const product = this;

  if (!product.isModified("name")) next();

  if (product.name) {
    product.name = product.name.replace(/\s+/g, " ").trim();
  }

  const existingProduct = await mongoose
    .model("products")
    .findOne({ name: product.name });
  if (existingProduct) {
    throw new BadRequest(ErrorMessage.UNIQUE_CONSTRAINT("name", product.name));
  }

  next();
});

ProductSchema.pre("findOneAndUpdate", async function (next) {
  const product = this;

  const productFound = await mongoose
    .model("products")
    .findById(product._conditions._id);
  if (product._update.name) {
    product._update.name = product._update.name.replace(/\s+/g, " ").trim();
  } else {
    product._update.name = productFound.name;
  }

  next();
});

export default mongoose.model("products", ProductSchema);
