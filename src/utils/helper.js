import { BadRequest } from "./error.js";

export function offsetTimezone(startDate, finalDate) {
  const diffLocalToUTC = new Date().getTimezoneOffset() * 60000;
  startDate = new Date(startDate);
  finalDate = new Date(finalDate);

  if (startDate > finalDate) {
    throw new BadRequest(`The start date must be before the end date.`);
  }

  finalDate.setUTCHours(23, 59, 59, 999);

  return {
    startDate: new Date(startDate.getTime() + diffLocalToUTC),
    finalDate: new Date(finalDate.getTime() + diffLocalToUTC),
  };
}

export function getPagination(page, perPage) {
  const limit = perPage && perPage > 0 ? perPage : 0;
  const skip = page && page > 0 ? (page - 1) * limit : 0;

  return { skip, limit };
}
