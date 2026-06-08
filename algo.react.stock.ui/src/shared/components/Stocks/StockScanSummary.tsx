import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, Table } from "reactstrap";
import { useAlgoContext } from "../../shared/context/AlgoContext";

type ApiResponse = {
  scanCounters: ScanCounter[];
};

function StockScanSummary() {
  const { scanCounters, isLoading, error, refresh } = useAlgoContext();

  if (isLoading) return <div>Loading...</div>;
  if (!scanCounters || scanCounters.length === 0) {
    return <div>No scan results available.</div>;
  }
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Today Scan Results</CardTitle>
        <div className="table-responsive">
          <button onClick={refresh}>🔄 Refresh Now</button>

          <Table className="table align-middle table-nowrap">
            {(scanCounters || [])?.map((item, key) => (
              <tbody key={key}>
                <tr>
                  <td>
                    <h5 className="font-size-14 m-0">
                      <Link to="#" className="text-dark">
                        {item.scanTypeText}
                      </Link>
                    </h5>
                  </td>
                  <td>
                    <div>
                      <Link
                        to={`/long-scan/${item.scanType}`}
                        className="badge bg-primary-subtle text-primary font-size-11 me-1"
                      >
                        {item.scanResultCount}
                      </Link>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
          </Table>
        </div>
      </CardBody>
    </Card>
  );
}

export default StockScanSummary;
