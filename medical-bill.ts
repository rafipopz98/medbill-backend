

const fs = require("fs");
import pdf from "pdf-parse";
import { findSimilarItems } from "./src/services/similarity";
import { detectOverpricedItems } from "./src/services/detectOverPrice";
import { generateDisputeScript } from "./src/services/dispute";
import { BillItem } from "./data";

let dataBuffer = fs.readFileSync("demo.pdf");

export const gg = () => {
  pdf(dataBuffer).then(function (data) {
    const text = data.text;
    const items = extractBillItems(text);
    console.table(items);
    // after extracting bills
    // check for the databse is there any bill
    const similarItems: [BillItem, BillItem][] = [];
    const similar = findSimilarItems(items, 0.5);
    similar.forEach(([i, j]) => {
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
    console.log("\nOverpriced Items:", overpriced);
    console.log("\nOverpriced Items:", similarItems);

    const gg = generateDisputeScript({
      patientName: "Emma Smith",
      billNumber: "#123456",
      overpricedItems: overpriced,
      duplicateItems: similarItems,
    });
  });
};

export const extractBillItems = (text: string) => {
  const itemSection = text.match(/ITEM DESCRIPTION([\s\S]*?)Notes/i);
  if (!itemSection) return [];

  const lines = itemSection[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  console.log("Raw Lines:", lines);

  const items = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Case 1: description and price in the same line
    const combinedMatch = line.match(/^(.*)\$\s?(\d+)/);
    console.log("Combined Match:", combinedMatch);
    if (combinedMatch) {
      const fullDesc = combinedMatch[1].trim();
      const price = combinedMatch[2];
      items.push({
        description: fullDesc,
        amount: `$${price}`,
      });
      console.log("Combined Match Items:", items);
      continue;
    }

    console.log("No match found for line:", line, items);
  }

  return items;
};
