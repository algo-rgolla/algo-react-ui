import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row } from "reactstrap";
import { ProductDetails } from "../../features/stocks/components/ProductDetails";
import { useFetch } from "../../hooks/useFetchData";
import { getScanTypeDescription } from "../../shared/utils/getScanTypeDescription";
import { ALGO_API_URLS } from "../../shared/utils/constants/apiConstants";

const LongScan: React.FC = () => {
  const { scanType } = useParams<{ scanType: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const url = ALGO_API_URLS.GET_LONGSCAN_RESULT_API_URL(scanType);
  const { data, error, loading } = useFetch<ApiResponse>(url, [scanType]);

  // Update products state when `data` changes
  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
      console.log("Fetched products:", data.products);
    }
  }, [data]);

  const handleClose = (symbol: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.symbol !== symbol)
    );
  };

  if (loading) return <p>Loading...</p>;

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div>
            <h2>Long Scan : {getScanTypeDescription(scanType)}</h2>
            <Row>
              {products.map((product) => (
                <ProductDetails
                  handleClose={handleClose}
                  product={product}
                  componentType="LongScan"
                />
              ))}
            </Row>{" "}
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LongScan;
