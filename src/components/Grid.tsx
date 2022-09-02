import styled from '@emotion/styled';
import { MouseEvent, useEffect, useState } from 'react';
import Cell, { CELL_SIZE } from './Cell';

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

export type Coordinate = [number, number];

function Grid() {
  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);
  const [mouse, setMouse] = useState<Coordinate>([0, 0]);

  // determine rows and columns
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

  // determine mouse position
  useEffect(() => {
    const calculateMousePosition = (e: globalThis.MouseEvent) => {
      setMouse([e.clientX, e.clientY]);
    };
    window.addEventListener('mousemove', calculateMousePosition);
    // cleanup
    return () => {
      window.removeEventListener('mousemove', calculateMousePosition);
    };
  }, []);

  return (
    <Container columns={columns}>
      {Array.from({ length: columns * rows })
        .fill('')
        .map((_, i) => (
          <Cell key={i} mouse={mouse} />
        ))}
    </Container>
  );
}

export default Grid;
