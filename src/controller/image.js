import { ImageService } from "../service/index.js";

async function uploadProfilePhoto(req, res, next) {
  try {
    const data = await ImageService.uploadProfilePhoto(req.params.id, req.file);

    res.status(200).send({
      data: { data, message: "Profile photo uploaded." },
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

export default { uploadProfilePhoto };
