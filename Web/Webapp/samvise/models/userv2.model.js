const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: true,
    },
    progress: { type: String, required: false },
    completionTime: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

// const User = mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema, "users2");

module.exports = User;
