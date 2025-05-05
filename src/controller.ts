import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { extractBillItems } from "../medical-bill";
import { findSimilarItems } from "./services/similarity";
import { detectOverpricedItems } from "./services/detectOverPrice";
import { generateDisputeScript } from "./services/dispute";
import { BillItem } from "../data";

export const uploadPDF = (req: Request, res: Response) => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads");
    const demoFilePath = path.join(uploadDir, "demo.pdf");
    let uploadedFilePath = "";
    if (req.file) {
      uploadedFilePath = path.join(uploadDir, req.file.filename);
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (fs.existsSync(demoFilePath)) {
      fs.unlinkSync(demoFilePath);
    }

    fs.rename(uploadedFilePath, demoFilePath, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        return res.status(500).json({ error: "Failed to rename file." });
      }

      res.status(200).json({ message: "File uploaded and saved as demo.pdf" });
    });
    res.send("File uploaded successfully.");
  } catch (error) {
    console.error("Error in uploadPDF:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const ScanErrors = (req: Request, res: Response) => {
  let dataBuffer = fs.readFileSync("uploads/demo.pdf");

  try {
    pdf(dataBuffer).then(function (data) {
      const text = data.text;
      const items = extractBillItems(text);
      console.table(items);

      const similarItems: [BillItem, BillItem][] = [];
      const similar = findSimilarItems(items, 0.5);
      console.log("Similar Items:", similar);
      similar.forEach(([i, j]) => {
        console.log(`Index ${i} and ${j} are similar:`);
        console.log(`- ${items[i].description}`);
        console.log(`- ${items[j].description}`);
        const item1: BillItem = {
          description: items[i].description,
          billed: parseFloat(items[i].amount.replace("$", "")),
        };

        const item2: BillItem = {
          description: items[j].description,
          billed: parseFloat(items[j].amount.replace("$", "")),
        };
        similarItems.push([item1, item2]);
      });

      const overpriced = detectOverpricedItems(items);
      console.log("\nOverpriced Items:");
      overpriced.forEach((item: any) => {
        console.log(`- ${item.description}`);
        console.log(`  ${item.reason}`);
      });

      res.status(200).json({
        message: "File scanned successfully.",
        similarItems: similarItems,
        overpricedItems: overpriced,
      });
    });
  } catch (error) {
    console.error("Error in ScanErrors:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const raiseDispute = (req: Request, res: Response) => {
  const { similarItems, overpricedItems, name, invoiceId } = req.body;
  try {
    const dispute_Copy = generateDisputeScript({
      patientName: name,
      billNumber: invoiceId,
      overpricedItems,
      duplicateItems: similarItems,
    });
    res.status(200).json({
      message: "Dispute script generated successfully.",
      disputeScript: dispute_Copy,
    });
    console.log("Dispute script:", dispute_Copy);
  } catch (error) {
    console.error("Error in raiseDispute:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
