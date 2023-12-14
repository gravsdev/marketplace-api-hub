import { Category } from "../model/index.js";
import { BadRequest, ErrorMessage, NotFound } from "../utils/error.js";
import { getPagination } from "../utils/helper.js";
import { checkIfIsNull, checkIfIdIsValid } from "../utils/valid.js";

async function create(category) {
  try {
    checkIfIsNull(category);

    return await Category.create(category);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errs = Object.values(error.errors).map((value) => value.message);
      throw new BadRequest(errs[errs.length - 1]);
    }

    throw error;
  }
}

async function update(_id, category) {
  try {
    checkIfIdIsValid(_id, "category");
    checkIfIsNull(category);

    const updatedCategory = await Category.findByIdAndUpdate(_id, category, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("category", "id", _id));
    }

    return updatedCategory;
  } catch (error) {
    if (error.name === "ValidationError") {
      const errs = Object.values(error.errors).map((value) => value.message);
      throw new BadRequest(errs[errs.length - 1]);
    }

    throw error;
  }
}

async function remove(_id) {
  try {
    checkIfIdIsValid(_id, "category");

    const removedCategory = await Category.findByIdAndDelete(_id);
    if (!removedCategory) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("category", "id", _id));
    }

    return removedCategory;
  } catch (error) {
    throw error;
  }
}

async function getAll(args) {
  try {
    const { page, perPage, filter } = args;
    const { skip, limit } = getPagination(page, perPage);

    const query = {};
    if (filter && Object.keys(filter).length !== 0) {
      if (filter.search) {
        query.$or = [{ name: { $regex: filter.search, $options: "i" } }];
      }
    }

    return await Category.find(query).skip(skip).limit(limit);
  } catch (error) {
    throw error;
  }
}

async function getById(_id) {
  try {
    checkIfIdIsValid(_id, "category");

    const category = await Category.findById(_id);
    if (!category) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("category", "id", _id));
    }

    return category;
  } catch (error) {
    throw error;
  }
}

export default { create, update, remove, getAll, getById };
