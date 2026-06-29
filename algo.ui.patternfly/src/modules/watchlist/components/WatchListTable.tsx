import { Button } from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import type { AlgoPortfolioProduct } from '../../../types/portfolio';

export interface WatchListTableProps {
  products: AlgoPortfolioProduct[];
  onViewProduct?: (product: AlgoPortfolioProduct) => void;
  onEditProduct: (product: AlgoPortfolioProduct) => void;
  onDeleteProduct: (product: AlgoPortfolioProduct) => void;
  deletingProductId?: number | null;
}

export default function WatchListTable({ products, onViewProduct, onEditProduct, onDeleteProduct, deletingProductId }: WatchListTableProps) {
  return (
    <Table aria-label="Watchlist table" variant="compact">
      <Thead>
        <Tr>
          <Th>Symbol</Th>
          <Th>Exchange</Th>
          <Th>Name</Th>
          <Th style={{ textAlign: 'right' }}>Volume</Th>
          <Th style={{ textAlign: 'right' }}>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product) => (
          <Tr key={product.id}>
            <Td>{product.symbol}</Td>
            <Td>{product.exchange}</Td>
            <Td>{product.name}</Td>
            <Td style={{ textAlign: 'right' }}>{Number(product.volume).toLocaleString()}</Td>
            <Td style={{ textAlign: 'right' }}>
              {onViewProduct && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onViewProduct(product)}
                  isDisabled={deletingProductId === product.id}
                >
                  View
                </Button>
              )}{' '}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEditProduct(product)}
                isDisabled={deletingProductId === product.id}
              >
                Edit
              </Button>{' '}
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDeleteProduct(product)}
                isDisabled={deletingProductId === product.id}
              >
                Delete
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
