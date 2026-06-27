import React from 'react';
import {
  Button,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { TrashIcon, PencilAltIcon } from '@patternfly/react-icons';
import './WatchListTable.css';

export interface Product {
  symbol: string;
  name: string;
  openDate: string;
  openPrice: number;
  id?: string;
}

export interface WatchListTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const WatchListTable: React.FC<WatchListTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <Table aria-label="Watchlist table" variant="compact">
      <Thead>
        <Tr>
          <Th>Symbol</Th>
          <Th>Name</Th>
          <Th>Open Date</Th>
          <Th>Open Price</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product, index) => (
          <Tr key={product.id || index}>
            <Td>{product.symbol}</Td>
            <Td>{product.name}</Td>
            <Td>{product.openDate}</Td>
            <Td>${product.openPrice}</Td>
            <Td>
              <div className="watchlist-table__actions">
                <Button
                  variant="plain"
                  onClick={() => onEdit?.(product)}
                  title="Edit"
                >
                  <PencilAltIcon />
                </Button>
                <Button
                  variant="plain"
                  onClick={() => onDelete?.(product)}
                  title="Delete"
                  isDanger
                >
                  <TrashIcon />
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default WatchListTable;
