import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row } from "reactstrap";
import { ProductDetails } from "../components/ProductDetails";
import { useFetch } from "../../../hooks/useFetchData";
import { WatchlistDetails } from "../components/WatchlistDetails";
import useDeleteWatchlist from "../../../hooks/useDeleteWatchlist";
import { DELETE_WATCHLIST_API_URL } from "../../../utils/constants/apiConstants";

const WatchList: React.FC = () => {
  const { scanType } = useParams<{ scanType: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const url = `/api/eodhd/products/watchlist`;
  const { data, error, loading } = useFetch<ApiResponse>(url, [scanType]);
  const {
    deleteItem,
    data: deleteData,
    error: deleteError,
    loading: deleteLoading,
  } = useDeleteWatchlist();

  // Update products state when `data` changes
  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data]);

  const handleClose = (symbol: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.symbol !== symbol)
    );
  };

  const handleDeleteWatchlistItem = (id: number) => {
    const url = DELETE_WATCHLIST_API_URL(id);
    deleteItem(url);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
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
            <h2>Watchlist (Count: {products.length})</h2>
            <Row>
              {products.map((product) => (
                <WatchlistDetails
                  handleClose={handleClose}
                  onDeleteWatchlist={handleDeleteWatchlistItem}
                  product={product}
                  componentType="Watchlist"
                />
              ))}
            </Row>{" "}
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default WatchList;
