import * as mongoose from "mongoose";

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: "{VALUE} already exists please select another one.",
    validate: [
      /[a-z0-9]{6,25}/,
      "Your username have to be at least 6 alphanumeric characters",
    ],
  },
  email: {
    type: String,
    required: true,
    validate: [
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    min: [6, "Your password have to be at least 6 characters length"],
  },
  created_at: { type: Date, default: Date.now() },
});

userSchema.plugin(beautifyUnique);

export const User = mongoose.model("User", userSchema);