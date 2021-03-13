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
    type: [recipe],
    required: false,
    default: [],
  },
  weekPlan: {
    mo: { recipe: { type: recipe }, lastUpdatedWeek: { type: Number } },
    tu: { recipe: { type: recipe }, lastUpdatedWeek: { type: Number } },
    we: { recipe: { type: recipe }, lastUpdatedWeek: { type: Number } },
    th: { recipe: { type: recipe }, lastUpdatedWeek: { type: Number } },
    fr: { recipe: { type: recipe }, lastUpdatedWeek: { type: Number } },
    sa: { recipe: { type: recipe }, lastUpdatedWeek: { type: Number } },
    su: { recipe: { type: recipe }, lastUpdatedWeek: { type: Number } },
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
