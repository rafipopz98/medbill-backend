import { data } from "../../data";

const flag_multiplier = 1.5;

export const detectOverpricedItems = (
  items: { description: string; amount: string }[]
) => {
  const flagged: any = [];

  items.forEach((item) => {
    const billedAmount = parseFloat(item.amount.replace("$", ""));
    let matchedKeyword = null;
    let cmsPrice: any = null;

    // Try to match any CMS keyword in the description
    for (const keyword of Object.keys(data)) {
      if (item.description.toLowerCase().includes(keyword.toLowerCase())) {
        matchedKeyword = keyword;
        cmsPrice = data[keyword];
        break;
      }
    }

    if (cmsPrice !== null && billedAmount > cmsPrice * flag_multiplier) {
      flagged.push({
        description: item.description,
        billed: billedAmount,
        cms: cmsPrice,
        reason: `Overpriced: Billed at $${billedAmount}, but CMS rate is $${cmsPrice.toFixed(
          2
        )}`,
      });
    }
  });

  return flagged;
};
