import styled from '@emotion/styled';
import {
  animate,
  AnimationOptions,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useEffect, useState } from 'react';
import Cell, { CELL_SIZE } from './Cell';

const Container = styled(motion.div)<{
  columns: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  mask-repeat: no-repeat;
  mask-image: radial-gradient(
    300px 300px,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.4),
    transparent
  );
`;

export type Coordinate = [number, number];

function Grid() {
  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);

  // mouse states
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXEased = useMotionValue(0);
  const mouseYEased = useMotionValue(0);
  const mouseXVelocity = useVelocity(mouseXEased);
  const mouseYVelocity = useVelocity(mouseYEased);
  const mouseVelocity = useTransform(
    [mouseXVelocity, mouseYVelocity],
    ([latestX, latestY]) =>
      Math.abs(latestX as number) + Math.abs(latestY as number)
  );
  const centerMouseX = useTransform(mouseX, (newX) => {
    return (newX as number) - window.innerWidth / 2;
  });
  const centerMouseY = useTransform(mouseY, (newY) => {
    return (newY as number) - window.innerHeight / 2;
  });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // animate mouse x and y
    animate(mouseX, e.clientX);
    animate(mouseY, e.clientY);
    // animate eased mouse x and y
    const transition: AnimationOptions<number> = {
      ease: 'easeOut',
      duration: 1,
    };
    animate(mouseXEased, e.clientX, transition);
    animate(mouseYEased, e.clientY, transition);
  };

  const opacity = useTransform(mouseVelocity, [0, 600], [0, 1]);
  const WebkitMaskPosition = useMotionTemplate`${centerMouseX}px ${centerMouseY}px`;

  return (
    <Container
      columns={columns}
      onMouseMove={(e) => handleMouseMove(e)}
      style={{
        opacity,
        WebkitMaskPosition,
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
