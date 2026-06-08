import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Row, Col, Container } from "reactstrap";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { ProductDetails } from "@features/stocks/components/ProductDetails";
import { Product } from "@features/stocks/types/product";
import { useFetch } from "@hooks/useFetchData";
import {
  calculateCapitalInvested,
  calculateTotalProfitLoss,
} from "@utils/algoUtils";
import { ALGO_API_URLS } from "@shared/utils/constants/apiConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProductsViewModel } from "@features/algo-portfolio/shared/algoInterfaces";
import {
  mapProductVMToProduct,
  validationSchema,
  initialValues,
} from "@features/algo-portfolio/shared/algoUtils";
import { PortfolioTable } from "@features/algo-portfolio/components/PortfolioTable";
import { AddEditModal } from "@features/algo-portfolio/components/AddEditModal";
import { ModalConfirmEdit } from "@features/algo-portfolio/components/ModalConfirmEdit";
import { ModalConfirmDelete } from "@features/algo-portfolio/components/ModalConfirmDelete";

const AlgoPortfolio: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reloadCounter, setReloadCounter] = useState(0);
  const [editingStock, setEditingStock] = useState<Product | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Product | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [optimisticData, setOptimisticData] = useState<Product[] | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const {
    data: fetchData,
    error,
    loading,
  } = useFetch<ProductsViewModel>(
    ALGO_API_URLS.GET_ALGO_PORTFOLIO_LIST_API_URL(),
    [reloadCounter]
  );

  // Map backend ProductViewModel (PascalCase) to client Product (lower-case)
  const data: Product[] = Array.isArray(fetchData?.Products)
    ? fetchData.Products.map(mapProductVMToProduct)
    : [];

  // displayed data supports optimistic updates
  const displayData = optimisticData ?? data;

  // clear optimistic cache when server data arrives
  useEffect(() => {
    setOptimisticData(null);
  }, [fetchData]);

  const handleAddStock = async (values: any, { resetForm }: any) => {
    setSubmitting(true);
    try {
      const algoPortfolioId = Number(
        editingStock?.id ?? editingStock?.portfolioId ?? 0
      );

      // optimistic update: show the updated/added row immediately
      if (algoPortfolioId && algoPortfolioId > 0) {
        // editing existing - update by numeric Id (client Product shape)
        setOptimisticData((prev) => {
          const base = prev ?? data;
          return base.map((r) =>
            r.id === algoPortfolioId
              ? {
                  ...r,
                  symbol: values.symbol,
                  volume: String(values.volume),
                  action: values.action,
                  openPrice: String(values.openPrice),
                }
              : r
          );
        });
      } else {
        // adding new - append a temp row with numeric negative Id (client Product shape)
        const tempId = -Date.now();
        setOptimisticData((prev) => {
          const base = prev ?? data;
          return [
            ...base,
            {
              id: tempId,
              portfolioId: 0,
              symbol: values.symbol,
              name: "",
              volume: String(values.volume),
              openPrice: String(values.openPrice),
              openDate: new Date().toLocaleDateString(),
              closeDate: null,
              close: "",
              change: "",
              closePrice: "",
              changePercent: "",
              status: "",
              marketCap: "",
              profitLoss: "0",
              comments: "",
              tradeDays: "",
              sellReason: null,
              buyReason: null,
              stopLoss: "",
              scanDate: new Date().toISOString(),
              scanType: "",
              stopPrice: "",
              atr: "",
              watchlistId: 0,
              action: values.action,
            },
          ];
        });
      }

      // perform API call - normalize id and include both possible field names
      const rawId = editingStock?.id ?? editingStock?.portfolioId ?? 0;
      const idNum = Number(rawId);
      const payload: any = {
        symbol: values.symbol,
        volume: values.volume,
        action: values.action,
        openPrice: values.openPrice,
      };
      if (idNum && idNum > 0) {
        payload.algoPortfolioId = idNum;
        payload.AlgoPortfolioId = idNum;
      } else {
        payload.algoPortfolioId = 0;
      }

      await axios.post(ALGO_API_URLS.GET_ALGO_PORTFOLIO_API_URL(), payload);

      // Refresh stocks list after successful add/edit
      setReloadCounter((c) => c + 1);
      setModalOpen(false);
      // notify on update
      if (algoPortfolioId && algoPortfolioId > 0) {
        toast.success("Stock successfully updated.");
      } else {
        toast.success("Stock successfully added.");
      }
      resetForm();
      setEditingStock(null);
    } catch (error) {
      toast.error("Failed to add/update stock. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Row className="align-items-center mb-3">
            <Col>
              <h2>Algo Portfolio</h2>
            </Col>
            <Col className="text-end">
              <Button color="primary" onClick={() => setModalOpen(true)}>
                Add Stock
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>Portfolio:</Col>
            <Col>
              <strong>{"Algo Portfolio"}</strong>
            </Col>
            <Col>Profit/Loss:</Col>
            <Col>
              <span
                className={
                  calculateTotalProfitLoss(data) > 0
                    ? "profit-text"
                    : "loss-text"
                }
              >
                {new Intl.NumberFormat("en-AU", {
                  style: "currency",
                  currency: "AUD",
                }).format(calculateTotalProfitLoss(data))}
              </span>
            </Col>
          </Row>

          <Row>
            <Col>Capital Amount:</Col>
            <Col>{calculateCapitalInvested(data)}</Col>
            <Col></Col>
            <Col></Col>
          </Row>

          <PortfolioTable
            data={displayData}
            onEdit={(p) => {
              setEditingCandidate(p);
              setConfirmOpen(true);
            }}
            onDelete={(p) => {
              setDeleteCandidate(p);
              setDeleteConfirmOpen(true);
            }}
          />

          <Row>
            {displayData.map((product, idx) => (
              <ProductDetails
                key={product.id || product.symbol || idx}
                product={product}
                componentType="Portfolio"
              />
            ))}
          </Row>

          <AddEditModal
            isOpen={modalOpen}
            toggle={() => setModalOpen(!modalOpen)}
            editingStock={editingStock}
            onSubmit={handleAddStock}
            submitting={submitting}
          />

          {/* Confirmation modal for editing */}
          <ModalConfirmEdit
            isOpen={confirmOpen}
            onConfirm={() => {
              setEditingStock(editingCandidate);
              setConfirmOpen(false);
              setModalOpen(true);
            }}
            onCancel={() => {
              setConfirmOpen(false);
              setEditingCandidate(null);
            }}
          />

          {/* Delete confirmation modal */}
          <ModalConfirmDelete
            isOpen={deleteConfirmOpen}
            onConfirm={async () => {
              if (!deleteCandidate) return;
              const id = deleteCandidate.id ?? deleteCandidate.portfolioId ?? 0;

              // optimistic remove (client product id)
              setOptimisticData((prev) => {
                const base = prev ?? data;
                return base.filter((r) => r.id !== id);
              });

              setDeleteConfirmOpen(false);
              try {
                const idNum = Number(
                  deleteCandidate.id ?? deleteCandidate.portfolioId ?? 0
                );
                if (!idNum || idNum <= 0)
                  throw new Error("Invalid portfolio id");

                await axios.delete(
                  ALGO_API_URLS.DELETE_ALGO_PORTFOLIO_API_URL(idNum),
                  { data: { algoPortfolioId: idNum } }
                );
                toast.success("Deleted successfully");
                setReloadCounter((c) => c + 1);
              } catch (err) {
                console.error(err);
                toast.error("Failed to delete stock. Please try again.");
                setReloadCounter((c) => c + 1);
              } finally {
                setDeleteCandidate(null);
              }
            }}
            onCancel={() => {
              setDeleteConfirmOpen(false);
              setDeleteCandidate(null);
            }}
          />

          <ToastContainer />
        </Container>
      </div>
    </>
  );
};

export default AlgoPortfolio;
