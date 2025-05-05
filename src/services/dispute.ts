import { BillItem } from "../../data";

export const generateDisputeScript = ({
  patientName,
  billNumber,
  overpricedItems = [],
  duplicateItems = [],
}: {
  patientName: string;
  billNumber: string;
  overpricedItems?: BillItem[];
  duplicateItems?: [BillItem, BillItem][];
}): string => {
  const lines: string[] = [];

  lines.push(
    `Hi, my name is ${patientName}. I'm calling regarding a recent medical bill with reference number ${billNumber}.`
  );

  if (overpricedItems.length > 0 && duplicateItems.length === 0) {
    lines.push(
      `I noticed I was billed for the following services at significantly higher rates than the standard Medicare reimbursement:`
    );
    overpricedItems.forEach((item) => {
      lines.push(
        `- ${item.description}: I was charged $${
          item.billed
        }, while the Medicare rate is approximately $${item.cms?.toFixed(2)}.`
      );
    });
    lines.push(
      `Can you explain why these services were charged so far above the standard rate? I’d like to request a review or reprocessing of this claim.`
    );
  }

  if (duplicateItems.length > 0 && overpricedItems.length === 0) {
    lines.push(
      `I noticed what appear to be duplicate charges for the following services:`
    );
    duplicateItems.forEach(([item1, item2]) => {
      lines.push(
        `- ${item1.description} appears more than once (e.g., $${item1.billed}, $${item2.billed}).`
      );
    });
    lines.push(
      `Could you clarify why these items were billed multiple times? I’d like to request a review or correction of the charges.`
    );
  }

  if (overpricedItems.length > 0 && duplicateItems.length > 0) {
    lines.push(
      `There are a couple of concerns I have with the charges on this bill:`
    );

    lines.push(`1. Overpriced Items:`);
    overpricedItems.forEach((item) => {
      lines.push(
        `   - ${item.description}: Charged $${
          item.billed
        }, while Medicare lists ~$${item.cms?.toFixed(2)}.`
      );
    });

    lines.push(`2. Duplicate Charges:`);
    duplicateItems.forEach(([item1, item2]) => {
      lines.push(
        `   - ${item1.description} appears multiple times ($${item1.billed}, $${item2.billed}).`
      );
    });

    lines.push(
      `Can someone please help me understand and correct these issues? I’d like to request a review of this claim.`
    );
  }

  return lines.join("\n");
};
