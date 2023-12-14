import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../model/index.js";
import {
  BadRequest,
  ErrorMessage,
  NotFound,
  Unauthorized,
} from "../utils/error.js";
import { getPagination, offsetTimezone } from "../utils/helper.js";
import { checkIfIdIsValid, checkIfIsNull } from "../utils/valid.js";
import { env } from "../config/index.js";

async function create(user) {
  try {
    checkIfIsNull(user);

    return await User.create(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errs = Object.values(error.errors).map((value) => value.message);
      throw new BadRequest(errs[errs.length - 1]);
    }

    throw error;
  }
}

async function update(_id, user) {
  try {
    checkIfIdIsValid(_id, "user");
    checkIfIsNull(user);

    const updatedUser = await User.findByIdAndUpdate(_id, user, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("user", "id", _id));
    }

    updatedUser.password = "********";

    return updatedUser;
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
    checkIfIdIsValid(_id, "user");

    const removedUser = await User.findByIdAndDelete(_id);
    if (!removedUser) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("user", "id", _id));
    }

    removedUser.password = "********";

    return removedUser;
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
          { username: { $regex: filter.search, $options: "i" } },
          { email: { $regex: filter.search, $options: "i" } },
        ];
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

    return await User.find(query).skip(skip).limit(limit);
  } catch (error) {
    if (error.name === "CastError" && error.valueType === "Date") {
      throw new BadRequest("The date format must be YYYY-MM-DD or MM-DD-YYYY.");
    }

    throw error;
  }
}

async function getById(_id) {
  try {
    checkIfIdIsValid(_id, "user");

    const user = await User.findById(_id);
    if (!user) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("user", "id", _id));
    }

    user.password = "********";

    return user;
  } catch (error) {
    throw error;
  }
}

async function login(username, password) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Unauthorized(ErrorMessage.INCORRECT_CREDENTIALS);
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw new Unauthorized(ErrorMessage.INCORRECT_CREDENTIALS);
    }

    const payload = {
      userId: user._id,
      username: user.username,
      isOwner: user.isOwner,
    };

    const token = jwt.sign(payload, env.token.authorization, {
      expiresIn: "2h",
    });

    user.password = "********";

    return { token, user };
  } catch (error) {
    throw error;
  }
}

export default { create, update, remove, getAll, getById, login };
