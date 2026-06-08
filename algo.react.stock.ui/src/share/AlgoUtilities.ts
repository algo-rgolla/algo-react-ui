// import {
//   asx100Stocks,
//   asx200Stocks,
//   asx20Stocks,
//   asx50Stocks,
// } from "../constants/algo-constants";

//export type ASXListType = "asx20" | "asx50" | "asx100" | "asx200";

// export const getStocks = (listType: string) => {
//   switch (listType) {
//     case "asx20":
//       return asx20Stocks;
//     case "asx50":
//       return asx50Stocks;
//     case "asx100":
//       return asx100Stocks;
//     case "asx200":
//       return asx200Stocks;

//     default:
//       return [];
//   }
// };

export const getStockListTitle = (listType: string) => {
  switch (listType) {
    case "asx20":
      return "ASX 20";
    case "asx50":
      return "ASX 50";
    case "asx100":
      return "ASX 100";
    case "asx200":
      return "ASX 200";
  }
};
