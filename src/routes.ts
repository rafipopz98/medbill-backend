import express from "express";
import multer from "multer";
import { raiseDispute, ScanErrors, uploadPDF } from "./controller";
const upload = multer({ dest: "uploads/" });

export const Router = express.Router();

//  upload pdf
Router.post(
  "/upload-medical-bill-pdf",
  upload.single("medical-bill"),
  uploadPDF
);

// scan for errors
Router.get("/scan-errors", ScanErrors);

// raising a dispute email
Router.get("/raise-dispute", raiseDispute);
