import React, { useEffect, useState, useMemo } from "react";
import { Col, Container, Input, Row } from "reactstrap";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import apiClient from "../../shared/utils/apiClient";
import { useParams } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { getScanTypeDescription } from "../../shared/utils/getScanTypeDescription";
import { calculateTotalProfitLoss } from "../../shared/utils/algoUtils";
import { ProductDetails } from "../../features/stocks/components/ProductDetails";
import { PortfolioHistoryDetails } from "../../features/stocks/components/PortfolioHistoryDetails";
import useDeleteWatchlist from "../../hooks/useDeleteWatchlist";
import { DELETE_PORTFOLIO_HISTORY_URL } from "../../shared/utils/constants/apiConstants";

const PortfolioHistory: React.FC = () => {
  const { portfolioHistoryType } = useParams<{
    portfolioHistoryType: string;
  }>();

  const [data, setData] = useState<IPortfolioHistory[]>([]);
  const {
    deleteItem,
    data: deleteData,
    error: deleteError,
    loading: deleteLoading,
  } = useDeleteWatchlist();

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = import.meta.env.VITE_APP_API_URL;

      try {
        const response = await apiClient.get(
          `${apiUrl}/api/eodhd/portfoliohistory?ScanName=${portfolioHistoryType}`
        );
        setData(response.data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [portfolioHistoryType]);

  const handleDeleteWatchlistItem = (id: number) => {
    const url = DELETE_PORTFOLIO_HISTORY_URL(id);
    deleteItem(url);

    setData((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "Symbol",
        accessor: "symbol", // accessor is the key in your data
      },
      {
        Header: "Open Date",
        accessor: "openDate",
      },
      {
        Header: "Open Price",
        accessor: "openPrice",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }: { value: string }) =>
          value === "Up" ? (
            <FaArrowUp color="green" />
          ) : value === "Down" ? (
            <FaArrowDown color="red" />
          ) : null,
      },
      {
        Header: "Close",
        accessor: "close",
      },
      {
        Header: "Profit/Loss",
        accessor: "profitLoss",
        Cell: ({ value }: { value: string }) => {
          const numericValue = parseFloat(value);
          if (numericValue > 0) {
            return (
              <span
                style={{
                  color: "green",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaArrowUp style={{ marginRight: "4px" }} />
                {value}
              </span>
            );
          } else if (numericValue < 0) {
            return (
              <span
                style={{ color: "red", display: "flex", alignItems: "center" }}
              >
                <FaArrowDown style={{ marginRight: "4px" }} />
                {value}
              </span>
            );
          }
          return value; // Display plain value if it's 0 or not a number
        },
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { sortBy: [{ id: "symbol", desc: false }] }, // Default sort
    },
    useGlobalFilter,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter } = state;

  return (
    <React.Fragment>
      <div className="page-content">
        <h2>Portfolio History (Count: {data.length})</h2>

        <Container fluid>
          <Row>
            <Col>Portfolio:</Col>
            <Col>
              <strong>{getScanTypeDescription(portfolioHistoryType)}</strong>
            </Col>
            <Col>Profit/Loss:</Col>
            <Col>
              <span
                style={{
                  color: calculateTotalProfitLoss(data) > 0 ? "green" : "red",
                }}
              >
                {new Intl.NumberFormat("en-AU", {
                  style: "currency",
                  currency: "AUD",
                }).format(calculateTotalProfitLoss(data))}
              </span>
            </Col>
          </Row>
          <div className="pt-3">
            <Input
              type="text"
              placeholder="Filter by symbol"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="mb-3"
            />
            <table
              {...getTableProps()}
              className="table table-hover table-striped"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        style={{ cursor: "pointer" }}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaArrowDown />
                            ) : (
                              <FaArrowUp />
                            )
                          ) : (
                            ""
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Row>
            {data.map((product) => (
              <PortfolioHistoryDetails
                product={product}
                onDeleteWatchlist={handleDeleteWatchlistItem}
                componentType="PortfolioHistory"
              />
            ))}
          </Row>{" "}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PortfolioHistory;
