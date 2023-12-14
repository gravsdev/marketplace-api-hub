import { ProductService, ImageService } from "../service/index.js";

async function create(req, res, next) {
  try {
    const data = await ProductService.create(req.body);

    res.status(201).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await ProductService.update(req.params.id, req.body);

    res.status(200).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

// async function uploadImage(req, res, next) {
//   try {
//     const data = await ImageService.uploadImageCategory(
//       req.params.id,
//       req.file
//     );

//     res.status(200).send({ data, errors: null });
//   } catch (error) {
//     next(error);
//   }
// }

async function remove(req, res, next) {
  try {
    const data = await ProductService.remove(req.params.id);

    res.status(200).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

async function products(req, res, next) {
  try {
    const filter = { search: req.query.search };

    const data = await ProductService.getAll({
      page: Number(req.query.page),
      perPage: Number(req.query.perPage),
      filter,
    });

    res.status(200).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

async function product(req, res, next) {
  try {
    const data = await ProductService.getById(req.params.id);

    res.status(200).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

export default {
  create,
  update,
  remove,
  products,
  product,
};
