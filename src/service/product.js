import { Product } from "../model/index.js";
import { BadRequest, ErrorMessage, NotFound } from "../utils/error.js";
import { getPagination, offsetTimezone } from "../utils/helper.js";
import { checkIfIsNull, checkIfIdIsValid } from "../utils/valid.js";
import { CategoryService } from "./index.js";

async function create(product) {
  try {
    checkIfIsNull(product);

    if (product.categoryId) {
      checkIfIdIsValid(product.categoryId, "category");
    }

    return await Product.create(product);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errs = Object.values(error.errors).map((value) => value.message);
      throw new BadRequest(errs[errs.length - 1]);
    }

    throw error;
  }
}

async function update(_id, product) {
  try {
    checkIfIdIsValid(_id, "product");
    checkIfIsNull(product);

    const updatedProduct = await Product.findByIdAndUpdate(_id, product, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("product", "id", _id));
    }

    return updatedProduct;
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
    checkIfIdIsValid(_id, "product");

    const removedProduct = await Product.findByIdAndDelete(_id);
    if (!removedProduct) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("product", "id", _id));
    }

    return removedProduct;
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
        query.$or = [
          { name: { $regex: filter.search, $options: "i" } },
          { description: { $regex: filter.search, $options: "i" } },
          { tags: { $in: [filter.search] } },
        ];
      }

      if (filter.byCategory && filter.byCategory.length > 0) {
        for (const categoryId of filter.byCategory) {
          await UsecaseCategory.getById(categoryId);
        }
        query.categoryId = { $in: filter.byCategory };
      }

      if (filter.byQuantity) {
        const { min, max } = filter.byQuantity;
        query.quantity = {
          $gte: min > 0 ? min : 0,
          $lte: max > 0 ? max : 0,
        };
      }

      if (filter.byPrice) {
        const { min, max } = filter.byPrice;
        query.price = {
          $gte: min > 0 ? min : 0,
          $lte: max > 0 ? max : 0,
        };
      }

      if (filter.byDateCreated) {
        const { start, final } = filter.byDateCreated;
        const { startDate, finalDate } = offsetTimezone(start, final);
        query.createdAt = { $gte: startDate, $lte: finalDate };
      }

      if (filter.byDateUpdated) {
        const { start, final } = filter.byDateUpdated;
        const { startDate, finalDate } = offsetTimezone(start, final);
        query.updatedAt = { $gte: startDate, $lte: finalDate };
      }
    }

    return await Product.find(query).skip(skip).limit(limit);
  } catch (error) {
    if (error.name === "CastError" && error.valueType === "Date") {
      throw new BadRequest("The date format must be YYYY-MM-DD or MM-DD-YYYY.");
    }

    throw error;
  }
}

async function getById(_id) {
  try {
    checkIfIdIsValid(_id, "product");

    const product = await Product.findById(_id);
    if (!product) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("product", "id", _id));
    }

    return product;
  } catch (error) {
    throw error;
  }
}

export default { create, update, remove, getAll, getById };
