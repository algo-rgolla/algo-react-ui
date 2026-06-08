import { ProductViewModel, AddStockFormValues } from "./algoInterfaces";
import { Product } from "@features/stocks/types/product";
import * as Yup from "yup";

export const mapProductVMToProduct = (p: ProductViewModel): Product => ({
  id: p.Id,
  portfolioId: p.PortfolioId,
  symbol: p.Symbol,
  name: p.Name,
  volume: p.Volume,
  openPrice: p.OpenPrice,
  openDate: p.OpenDate,
  closeDate: p.CloseDate ?? null,
  close: p.Close,
  change: p.Change,
  closePrice: p.ClosePrice,
  changePercent: p.ChangePercent,
  status: p.Status,
  marketCap: p.MarketCap ?? "",
  profitLoss: p.ProfitLoss,
  comments: p.Comments ?? "",
  tradeDays: p.TradeDays ?? "",
  sellReason: p.SellReason ?? null,
  buyReason: p.BuyReason ?? null,
  stopLoss: p.StopLoss ?? "",
  scanDate: p.ScanDate ?? "",
  scanType: p.ScanType ?? "",
  stopPrice: "",
  atr: p.Atr ?? "",
  watchlistId: 0,
});

export const initialValues: AddStockFormValues = {
  symbol: "",
  volume: 0,
  action: "Buy",
  openPrice: 0,
};

export const validationSchema = Yup.object({
  symbol: Yup.string()
    .length(3, "Symbol must be exactly 3 characters")
    .required("Symbol is required"),
  volume: Yup.number()
    .integer("Volume must be an integer")
    .min(1, "Volume must be at least 1")
    .required("Volume is required"),
  action: Yup.string()
    .oneOf(["Buy", "Sell"], "Action must be Buy or Sell")
    .required("Action is required"),
  openPrice: Yup.number()
    .typeError("Open Price must be a number (e.g. 145.55)")
    .min(0, "Open Price must be positive")
    .required("Open Price is required"),
});
