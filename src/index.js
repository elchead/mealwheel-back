const PORT = process.env.PORT || 5000;
const express = require("express");
const app = express();
const cors = require("cors");

const recipeRoutes = require("./routes/recipes");
app.use(cors());
app.use("/", recipeRoutes);

app.get("/test", (req, res) => {
  res.send(`${Date.now()}`);
});

app.listen(PORT);
console.log("listening on: http://localhost:5000/recipes");
module.exports = app; // for testing
