const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully!");
});

const movieDataRouter = require("./routes/moviedata");
const usersRouter = require("./routes/users");
const questionnairesRouter = require("./routes/questionnaires");
// const ratingsRouter = require("./routes/ratings");

app.use("/moviedata", movieDataRouter);
app.use("/users", usersRouter);
app.use("/questionnaires", questionnairesRouter);

// app.use("/ratings", ratingsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
