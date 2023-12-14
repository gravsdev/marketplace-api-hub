import { isValidObjectId } from "mongoose";
import { BadRequest } from "./error.js";

export function checkIfIsNull(field) {
  if (!field || Object.keys(field).length === 0) {
    throw new BadRequest("No values ​​provided.");
  }
}

export function checkIfIdIsValid(id, model) {
  if (!isValidObjectId(id)) {
    throw new BadRequest(`The ID \"${id}\" of the \"${model}\" is invalid.`);
  }
}
