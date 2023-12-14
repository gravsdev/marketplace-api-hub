import { UserService } from "../service/index.js";

async function signUp(req, res, next) {
  try {
    const data = await UserService.create(req.body);

    res.status(201).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

async function signIn(req, res, next) {
  try {
    const { username, password } = req.body;
    const data = await UserService.login(username, password);

    res.status(200).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

async function editProfile(req, res, next) {
  try {
    const data = await UserService.update(req.params.id, req.body);

    res.status(200).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

async function removeAccount(req, res, next) {
  try {
    const data = await UserService.remove(req.params.id);

    res.status(200).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

async function users(req, res, next) {
  try {
    const filter = { search: req.query.search };

    if (req.query.createdAfter && req.query.createdBefore) {
      filter.byDateCreated = {
        start: req.query.createdAfter,
        final: req.query.createdBefore,
      };
    }

    if (req.query.updatedAfter && req.query.updatedBefore) {
      filter.byDateUpdated = {
        start: req.query.updatedAfter,
        final: req.query.updatedBefore,
      };
    }

    const data = await UserService.getAll({
      page: Number(req.query.page),
      perPage: Number(req.query.perPage),
      filter,
    });

    res.status(200).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

async function user(req, res, next) {
  try {
    const data = await UserService.getById(req.params.id);

    res.status(200).send({ data, errors: null });
  } catch (error) {
    next(error);
  }
}

export default { signUp, signIn, editProfile, removeAccount, users, user };
