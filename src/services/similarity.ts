import { compareTwoStrings } from "string-similarity";

interface BillItem {
  description: string;
  amount: string;
}

export const findSimilarItems = (
  items: BillItem[],
  threshold: number = 0.5
) => {
  try {
    const similarGroups: [number, number][] = [];

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const similarity = compareTwoStrings(
          items[i].description.toLowerCase(),
          items[j].description.toLowerCase()
        );
        console.log(similarity, threshold);
        if (similarity >= threshold) {
          console.log(
            `Comparing "${items[i].description}" with "${items[j].description}": ${similarity}`
          );
        }

        if (similarity >= threshold) {
          similarGroups.push([i, j]);
        }
      }
    }

    return similarGroups;
  } catch (error) {
    console.error("Error in findSimilarItems:", error);
    return [];
  }
};
