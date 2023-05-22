const mongoose = require("mongoose"),
  { v4 } = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      uppercase: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },

      password: {

        type: String,
        minlength: 6

      },
      confirmPassword: {

        type: String,
        minlength: 6

      },
      role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    _id: {
      type: String,
      default: () => v4(),
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = { User };
