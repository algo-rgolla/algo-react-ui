import moment from "moment-timezone";

export function calculateTotalProfitLoss(products: Product[]): number {
  return products.reduce((total, product) => {
    const profitLoss = parseFloat(product.profitLoss);
    return total + (isNaN(profitLoss) ? 0 : profitLoss);
  }, 0);
}

export function calculateCapitalInvested(products: Product[]): string {
  const totalCapital = products.reduce((capital, product) => {
    const volume = parseFloat(product.volume);
    const openPrice = parseFloat(product.openPrice);
    const investment = volume * openPrice;
    return capital + (isNaN(investment) ? 0 : investment);
  }, 0);

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(totalCapital);
}

export const convertToAustralianTime = (dateString?: string) => {
  if (!dateString) return "Invalid Date";
  return moment(dateString)
    .tz("Australia/Sydney")
    .format("DD/MM/YYYY, h:mm:ss A");
};
