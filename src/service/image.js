import { User } from "../model/index.js";
import { BadRequest, ErrorMessage, NotFound } from "../utils/error.js";
import { uploadS3File, getS3FileURL } from "../utils/s3.js";
import { checkIfIdIsValid } from "../utils/valid.js";

async function uploadProfilePhoto(_id, file) {
  try {
    checkIfIdIsValid(_id, "user");

    if (!file) {
      throw new BadRequest(ErrorMessage.IMAGE_NOT_PROVIDED);
    }
    const { filename } = await uploadS3File(file);
    const fileURL = await getS3FileURL(filename);

    const userFound = await User.findById(_id);
    if (!userFound) {
      throw new NotFound(ErrorMessage.NOT_FOUND_FIELD("user", "id", _id));
    }

    userFound.photo.name = filename;
    userFound.photo.path = fileURL;

    const data = await userFound.save();
    data.password = "********";

    return data;
  } catch (error) {
    throw error;
  }
}

export default { uploadProfilePhoto };
