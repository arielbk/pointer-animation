import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Coordinate } from './Grid';

export const CELL_SIZE = 80;

const Container = styled.div`
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  border: 1px dashed #333;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled(motion.div)<{ direction: number }>`
  font-size: 2rem;
  color: #333;
  rotate: ${(props) => props.direction + 'deg'};
`;

interface CellProps {
  mouse: Coordinate;
}

const Cell: React.FC<CellProps> = ({ mouse }) => {
  const [position, setPosition] = useState<Coordinate>([0, 0]);
  const [direction, setDirection] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // center x coordinate
    const x = rect.left + CELL_SIZE / 2;
    // center y coordinate
    const y = rect.top + CELL_SIZE / 2;
    setPosition([x, y]);
  }, []);

  useEffect(() => {
    const diffY = mouse[1] - position[1];
    const diffX = mouse[0] - position[0];
    const angleRadians = Math.atan2(diffY, diffX);
    const angleDegrees = Math.floor(angleRadians * (180 / Math.PI));
    setDirection(angleDegrees);
  }, [mouse]);

  return (
    <Container ref={ref}>
      <Content direction={direction}>→</Content>
    </Container>
  );
};

export default Cell;
