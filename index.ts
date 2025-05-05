import express from "express";
import { gg } from "./medical-bill";
import { Router } from "./src/routes";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", Router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
// main().catch(console.error);

// gg();
