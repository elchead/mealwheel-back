const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipe = {
  name: String,
  id: Number,
  minutes: Number,
  nutrition: [Number],
  steps: [String],
  description: String,
};
const schema = new Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  recipes: {
    type: recipe,
    required: false,
  },
  weekPlan: {
    mo: { type: recipe },
    tu: { type: recipe },
    we: { type: recipe },
    th: { type: recipe },
    fr: { type: recipe },
    sa: { type: recipe },
    su: { type: recipe },
  },
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  },
});

module.exports = mongoose.model("User", schema);
