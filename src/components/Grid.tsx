import styled from '@emotion/styled';
import {
  animate,
  AnimationOptions,
  motion,
  useMotionValue,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useEffect, useState } from 'react';
import Cell, { CELL_SIZE } from './Cell';

const Container = styled(motion.div)<{
  columns: number;
  centerMouse: [number, number];
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  mask-image: radial-gradient(
    400px 400px,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.2),
    transparent
  );
  mask-repeat: no-repeat;
  mask-position: ${({ centerMouse }) =>
    `${centerMouse[0]}px ${centerMouse[1]}px`};
`;

export type Coordinate = [number, number];

function Grid() {
  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);
  const [mouse, setMouse] = useState<Coordinate>([0, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXVelocity = useVelocity(mouseX);
  const mouseYVelocity = useVelocity(mouseY);
  const change = useTransform(
    [mouseXVelocity, mouseYVelocity],
    ([latestX, latestY]) =>
      Math.abs(latestX as number) + Math.abs(latestY as number)
  );
  const opacity = useTransform(change, [0, 1000], [0, 1]);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [centerMouse, setCenterMouse] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    setCenterMouse([mouse[0] - width / 2, mouse[1] - height / 2]);
  }, [width, mouse, height]);

  // determine rows and columns
  useEffect(() => {
    // possibly use a resize observer here instead
    if (typeof window === 'undefined') return;
    const calculateGrid = () => {
      setWidth(window.innerWidth);
      const columnCount = Math.ceil(window.innerWidth / CELL_SIZE);
      setColumns(columnCount);
      setHeight(window.innerHeight);
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
    <Container
      columns={columns}
      centerMouse={centerMouse}
      onMouseMove={(e) => {
        setMouse([e.clientX, e.clientY]);
        // motion values
        const transition: AnimationOptions<number> = {
          ease: 'easeOut',
        };
        animate(mouseX, e.clientX, transition);
        animate(mouseY, e.clientY, transition);
      }}
      style={{
        opacity,
      }}
    >
      {Array.from({ length: columns * rows })
        .fill('')
        .map((_, i) => (
          <Cell key={i} mouse={mouse} />
        ))}
    </Container>
  );
}

export default Grid;
