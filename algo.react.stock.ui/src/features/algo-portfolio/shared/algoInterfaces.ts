export interface ProductViewModel {
  Id: number;
  PortfolioId: number;
  Symbol: string;
  Name: string;
  Volume: string;
  OpenPrice: string;
  OpenDate: string;
  CloseDate: string;
  Close: string;
  Change: string;
  ClosePrice: string;
  ChangePercent: string;
  Status: string;
  MarketCap?: string;
  Industry: string;
  Sector: string;
  ProfitLoss: string;
  Comments: string;
  TradeDays: string;
  SellReason: string;
  BuyReason: string;
  StopLoss: string;
  ScanDate: string;
  ScanType: string;
  Atr: string;
  Action: string;
}

export interface ProductsViewModel {
  ScanType: string;
  ProductViewType: string;
  PageTotal: number;
  PageHeader: string;
  Products: ProductViewModel[];
}

export interface AddStockFormValues {
  symbol: string;
  volume: number;
  action: "Buy" | "Sell";
  openPrice: number;
}
