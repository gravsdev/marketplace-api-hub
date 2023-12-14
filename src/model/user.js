import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { BadRequest, ErrorMessage, NotFound } from "../utils/error.js";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, ErrorMessage.REQUIRED_CONSTRAINT("username")],
      validate: {
        validator: (value) => {
          const usernameRegex =
            /^(?![.])(?!.*[.]$)(?!.*([.]{2,}))[A-Za-z0-9.]{1,32}$/;

          return usernameRegex.test(value);
        },
        message: (props) => ErrorMessage.INVALID_FIELD("username", props.value),
      },
    },
    password: {
      type: String,
      required: [true, ErrorMessage.REQUIRED_CONSTRAINT("password")],
      validate: {
        validator: (value) => {
          const passwordRegex = /^(?!.*\s).{8,}$/;

          return passwordRegex.test(value);
        },
        message: (props) => ErrorMessage.INVALID_FIELD("password", props.value),
      },
    },
    email: {
      type: String,
      required: [true, ErrorMessage.REQUIRED_CONSTRAINT("email")],
      validate: {
        validator: (value) => {
          const emailRegex = /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

          return emailRegex.test(value);
        },
        message: (props) => ErrorMessage.INVALID_FIELD("email", props.value),
      },
    },
    isOwner: { type: Boolean, default: false },
    photo: { name: { type: String }, path: { type: String } },
    details: {
      name: { type: String },
      company: { type: String },
      location: { type: String },
    },
  },
  { versionKey: false, timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("username")) next();

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  const existingUser = await mongoose
    .model("users")
    .findOne({ username: user.username });
  if (existingUser) {
    throw new BadRequest(
      ErrorMessage.UNIQUE_CONSTRAINT("username", user.username)
    );
  }

  user.isOwner = false;

  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const user = this;

  const userFound = await mongoose
    .model("users")
    .findById(user._conditions._id);

  if (!userFound) {
    throw new NotFound(
      ErrorMessage.NOT_FOUND_FIELD("user", "id", user._conditions._id)
    );
  }
  user._update.username = userFound.username;
  user._update.email = user._update.email || userFound.email;

  if (user._update.password) {
    await mongoose.model("users")(user._update).validate();
    user._update.password = await bcrypt.hash(user._update.password, 10);
  }

  user._update.isOwner = false;

  next();
});

export default mongoose.model("users", UserSchema);
