const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
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

//import routes
const movieDataRoute = require("./routes/moviedata");
const questionnairesRoute = require("./routes/questionnaires");
const answerRoute = require("./routes/answers");
const authRoute = require("./routes/auth");
// const ratingsRouter = require("./routes/ratings");

app.use("/auth", authRoute);
app.use("/moviedata", movieDataRoute);
app.use("/questionnaires", questionnairesRoute);
app.use("/answers", answerRoute);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
