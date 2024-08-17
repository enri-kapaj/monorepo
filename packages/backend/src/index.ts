import express from "express";
import router from "./routes/router";
import connectDB from "./config/db";
import cors from "cors";

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/", router);

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
