import React from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Button } from "reactstrap";
import { Product } from "@features/stocks/types/product";

interface Props {
  data: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

export const PortfolioTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="pt-3">
      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Open Date</th>
            <th>Open Price</th>
            <th>Status</th>
            <th>Close</th>
            <th>Profit/Loss</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || row.symbol || idx}>
              <td>{row.symbol}</td>
              <td>{row.openDate}</td>
              <td>{row.openPrice}</td>
              <td>
                {row.status === "Up" ? (
                  <FaArrowUp color="green" />
                ) : row.status === "Down" ? (
                  <FaArrowDown color="red" />
                ) : null}
              </td>
              <td>{row.close}</td>
              <td>
                <span
                  className={
                    parseFloat(row.profitLoss) > 0 ? "profit-text" : "loss-text"
                  }
                >
                  {parseFloat(row.profitLoss) > 0 ? (
                    <FaArrowUp style={{ marginRight: "4px" }} />
                  ) : (
                    <FaArrowDown style={{ marginRight: "4px" }} />
                  )}
                  {row.profitLoss}
                </span>
              </td>
              <td>
                <Button
                  color="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(row)}
                >
                  Edit
                </Button>
                <Button color="danger" size="sm" onClick={() => onDelete(row)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
