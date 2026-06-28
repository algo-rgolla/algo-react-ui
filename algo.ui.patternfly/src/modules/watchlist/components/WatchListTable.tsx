import { Button } from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import type { AlgoPortfolioProduct } from '../../../types/portfolio';

export interface WatchListTableProps {
  products: AlgoPortfolioProduct[];
  onDeleteProduct: (product: AlgoPortfolioProduct) => void;
  deletingProductId?: number | null;
}

export default function WatchListTable({ products, onDeleteProduct, deletingProductId }: WatchListTableProps) {
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
