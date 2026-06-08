import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Table } from "reactstrap";

export default function ScanSummary() {
  const [assets] = useState([
    {
      icon: "mdi mdi-bitcoin",
      color: "warning",
      title: "BTC",
      investRate: "1.2601",
      investPrice: "6225.74",
      price: "7525.47",
      loansRate: "0.1512",
      loansPrice: "742.32",
      totalRate: "4.2562",
      totalPrice: "6425.42",
    },
    {
      icon: "mdi mdi-ethereum",
      color: "primary",
      title: "ETH",
      investRate: "0.0814",
      investPrice: "3256.29",
      price: "4235.78",
      loansRate: "0.0253",
      loansPrice: "675.04",
      totalRate: "0.0921",
      totalPrice: "4536.24",
    },
  ]);

  return (
    <div>
      <Card>
        <CardBody>
          <h4 className="card-title mb-4">Today Scan Result</h4>

          <div className="table-responsive">
            <Table className="table table-nowrap align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Scan</th>
                  <th scope="col">Result</th>
                  <th scope="col">Invest</th>
                  <th scope="col">Loans</th>
                  <th scope="col" colSpan="2">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {(assets || [])?.map((asset, key) => (
                  <tr key={key}>
                    <th scope="row">
                      <div className="d-flex align-items-center">
                        <div className="avatar-xs me-3">
                          <span
                            className={
                              "avatar-title rounded-circle bg-" +
                              asset.color +
                              "-subtle text-" +
                              asset.color +
                              " font-size-18"
                            }
                          >
                            <i className={asset.icon} />
                          </span>
                        </div>
                        <span>{asset.title}</span>
                      </div>
                    </th>
                    <td>
                      <div className="text-muted">$ {asset.price}</div>
                    </td>
                    <td>
                      <h5 className="font-size-14 mb-1">{asset.investRate}</h5>
                      <div className="text-muted">${asset.investPrice}</div>
                    </td>
                    <td>
                      <h5 className="font-size-14 mb-1">{asset.loansRate}</h5>
                      <div className="text-muted">${asset.loansPrice}</div>
                    </td>
                    <td>
                      <h5 className="font-size-14 mb-1">{asset.totalRate}</h5>
                      <div className="text-muted">${asset.totalPrice}</div>
                    </td>
                    <td style={{ width: "120px" }}>
                      <Link to="#" className="btn btn-primary btn-sm w-xs">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
