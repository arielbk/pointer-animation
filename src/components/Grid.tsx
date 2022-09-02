import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

const CELL_SIZE = 80;

const Container = styled.div<{ columns: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
`;

const Cell = styled.div`
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  border: 1px dashed #777;
`;

function Grid() {
  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    // possibly use a resize observer here instead
    if (typeof window === 'undefined') return;
    const calculateGrid = () => {
      const columnCount = Math.ceil(window.innerWidth / CELL_SIZE);
      setColumns(columnCount);
      const rowCount = Math.ceil(window.innerHeight / CELL_SIZE);
      setRows(rowCount);
    };
    // calculate the grid on load
    calculateGrid();
    // recalculate grid on resize
    window.addEventListener('resize', calculateGrid);
    // cleanup
    return () => {
      window.removeEventListener('resize', calculateGrid);
    };
  }, []);

  return (
    <Container columns={columns}>
      {Array.from({ length: columns * rows })
        .fill('')
        .map((_, i) => (
          <Cell key={i} />
        ))}
    </Container>
  );
}

export default Grid;
