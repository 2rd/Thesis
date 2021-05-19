const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = require("./config/keys").ATLAS_URI;
// const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully!");
});

//import routes
const indexRoute = require("./routes/index");
const movieDataRoute = require("./routes/moviedata");
const questionnairesRoute = require("./routes/questionnaires");
const answerRoute = require("./routes/answers");
// const authRoute = require("./routes/auth");
const authRoute = require("./routes/authv2");
const newsletterRoute = require("./routes/newsletter");
const ratingRoute = require("./routes/ratings");
const recommendationsRoute = require("./routes/recommendations");
const genreRoute = require("./routes/genres");

//USE BUILD
app.use(express.static("client/build"));

app.use("/index", indexRoute);
app.use("/auth", authRoute);
app.use("/moviedata", movieDataRoute);
app.use("/questionnaires", questionnairesRoute);
app.use("/answers", answerRoute);
app.use("/ratings", ratingRoute);
app.use("/recommendations", recommendationsRoute);
app.use("/genres", genreRoute);
app.use("/", newsletterRoute);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
