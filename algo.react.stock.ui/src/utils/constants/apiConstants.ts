export const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

// Scan Counters
export const SCAN_COUNTERS_API_URL = `${API_BASE_URL}/api/longscan/scan-counters`;

// Portfolio
export const CREATE_PORTFOLIO_API_URL = `${API_BASE_URL}/api/Portfolio/create-portfolio`;
export const GET_PORTFOLIO_API_URL = `${API_BASE_URL}/api/Portfolio/get-portfolio`;
export const GET_PORTFOLIO_LIST_API_URL = (portfolioType: string) =>
  `${API_BASE_URL}/api/Portfolio/portfolio-list?ScanName=${portfolioType}`;
export const GET_ALGO_PORTFOLIO_LIST_API_URL = `${API_BASE_URL}/api/Portfolio/algo-portfolio-list`;

// Common
export const GET_STOCK_STATISTICS_API_URL = `${API_BASE_URL}/api/Portfolio/portfolio-statistics`;

// Authentication
export const LOGIN_API_URL = `${API_BASE_URL}/api/auth/login`;
export const REGISTER_API_URL = `${API_BASE_URL}/api/auth/register`;
export const LOGOUT_API_URL = `${API_BASE_URL}/api/auth/logout`;

// Watchlist
export const WATCHLIST_API_URL = `${API_BASE_URL}/api/eodhd/products/watchlist`;
export const DELETE_WATCHLIST_API_URL = (id: number) =>
  `${API_BASE_URL}/api/watchlist/delete/${id}`;

// Product Search
export const PRODUCT_SEARCH_API_URL = `${API_BASE_URL}/api/eodhd/products/search?AsxType=asx20`;
export const PRODUCT_SEARCH_PRODUCT_API_URL = (
  searchType: string | undefined
) =>
  `${API_BASE_URL}/api/eodhd/products/search-product?SearchType=${searchType}`;

// Portfolio History
export const DELETE_PORTFOLIO_HISTORY_URL = (id: number) =>
  `${API_BASE_URL}/api/portfoliohistory/delete/${id}`;

// LongScan
export const GET_LONGSCAN_RESULT_API_URL = (scanType: string | undefined) =>
  `${API_BASE_URL}/api/longscan/get-scan-result?ScanName=${scanType}`;
