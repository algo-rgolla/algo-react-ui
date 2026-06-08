import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row } from "reactstrap";
import { ProductDetails } from "../../features/stocks/components/ProductDetails";
import { useFetch } from "../../hooks/useFetchData";
import { getStockListTitle } from "../../share/AlgoUtilities";

const AsxSectors = () => {
  const { asxListType } = useParams<{ asxListType: string }>();
  const stockListTitle = asxListType ? getStockListTitle(asxListType) : "";
  const url = `/api/eodhd/products/${asxListType}`;
  const { data, error, loading } = useFetch<ApiResponse>(url, [asxListType]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div>
            <h2>{stockListTitle}</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "20px",
              }}
            >
              <Row>
                {data?.products?.map((product) => (
                  <ProductDetails product={product} componentType="" />
                ))}
              </Row>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AsxSectors;
