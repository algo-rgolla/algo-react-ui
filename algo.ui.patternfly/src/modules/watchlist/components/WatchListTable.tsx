import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import type { AlgoPortfolioProduct } from '../../../types/portfolio';

export interface WatchListTableProps {
  products: AlgoPortfolioProduct[];
}

export default function WatchListTable({ products }: WatchListTableProps) {
  return (
    <Table aria-label="Watchlist table" variant="compact">
      <Thead>
        <Tr>
          <Th>Symbol</Th>
          <Th>Exchange</Th>
          <Th>Name</Th>
          <Th style={{ textAlign: 'right' }}>Volume</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product) => (
          <Tr key={`${product.portfolioId}-${product.symbol}-${product.scanDate}`}>
            <Td>{product.symbol}</Td>
            <Td>{product.exchange}</Td>
            <Td>{product.name}</Td>
            <Td style={{ textAlign: 'right' }}>{Number(product.volume).toLocaleString()}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
