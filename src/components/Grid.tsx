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
  const mouseXEased = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseYEased = useMotionValue(0);

  const mouseXVelocity = useVelocity(mouseXEased);
  const mouseYVelocity = useVelocity(mouseYEased);
  const change = useTransform(
    [mouseXVelocity, mouseYVelocity],
    ([latestX, latestY]) =>
      Math.abs(latestX as number) + Math.abs(latestY as number)
  );
  const opacity = useTransform(change, [0, 900], [0, 1]);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouse([e.clientX, e.clientY]);
    // motion values
    const transition: AnimationOptions<number> = {
      ease: 'easeOut',
      duration: 1.4,
    };
    animate(mouseX, e.clientX);
    animate(mouseXEased, e.clientX, transition);
    animate(mouseY, e.clientY);
    animate(mouseYEased, e.clientY), transition;
  };

  return (
    <Container
      columns={columns}
      centerMouse={centerMouse}
      onMouseMove={(e) => requestAnimationFrame(() => handleMouseMove(e))}
      style={{
        opacity,
      }}
    >
      {Array.from({ length: columns * rows })
        .fill('')
        .map((_, i) => (
          <Cell key={i} mouseX={mouseX} mouseY={mouseY} />
        ))}
    </Container>
  );
}

export default Grid;
