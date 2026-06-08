import React from "react";
import { Navigate } from "react-router-dom";

// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";
import LongScan from "../pages/Stocks/LongScan";
import Portfolio from "../pages/Stocks/Portfolio";
import AlgoPortfolio from "../features/algo-portfolio/AlgoPortfolio";
import PortfolioHistory from "../pages/Stocks/PortfolioHistory";
import CreatePortfolio from "../pages/Stocks/CreatePortfolio";

import MarketIndicies from "../pages/Stocks/MarketIndicies";
import Commodities from "../pages/Stocks/Commodities";
import AsxSectors from "../pages/Stocks/AsxSectors";
import { AlgoContextProvider } from "../shared/context/AlgoContext";
import AlgoPortfolioHistory from "../pages/Stocks/AlgoPortfolioHistory";

const authProtectedRoutes = [
  {
    path: "/dashboard",
    component: (
      <AlgoContextProvider>
        <Dashboard />
      </AlgoContextProvider>
    ),
  },
  { path: "/long-scan/:scanType", component: <LongScan /> },

  { path: "/portfolio/:portfolioType", component: <Portfolio /> },
  { path: "/algo-portfolio", component: <AlgoPortfolio /> },
  {
    path: "/portfolio-history/:portfolioHistoryType",
    component: <PortfolioHistory />,
  },
  {
    path: "/algo-portfolio-history/:portfolioHistoryType",
    component: <AlgoPortfolioHistory />,
  },
  { path: "/create-portfolio", component: <CreatePortfolio /> },
  { path: "/market-indicies", component: <MarketIndicies /> },
  { path: "/commodities", component: <Commodities /> },
  { path: "/asx-sectors", component: <AsxSectors /> },

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
];

// export { authProtectedRoutes, publicRoutes };
export { authProtectedRoutes, publicRoutes };
