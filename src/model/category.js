import mongoose from "mongoose";
import { BadRequest, ErrorMessage } from "../utils/error.js";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ErrorMessage.REQUIRED_CONSTRAINT("name")],
    },
    image: { name: { type: String }, path: { type: String } },
  },
  { versionKey: false, timestamps: true }
);

CategorySchema.pre("save", async function (next) {
  const category = this;

  if (!category.isModified("name")) next();

  if (category.name) {
    category.name = category.name.replace(/\s+/g, " ").trim();
  }

  const existingCategory = await mongoose
    .model("categories")
    .findOne({ name: category.name });
  if (existingCategory) {
    throw new BadRequest(ErrorMessage.UNIQUE_CONSTRAINT("name", category.name));
  }

  next();
});

CategorySchema.pre("findOneAndUpdate", async function (next) {
  const category = this;

  const categoryFound = await mongoose
    .model("categories")
    .findById(category._conditions._id);
  if (category._update.name) {
    category._update.name = category._update.name.replace(/\s+/g, " ").trim();
  } else {
    category._update.name = categoryFound.name;
  }

  next();
});

export default mongoose.model("categories", CategorySchema);
