import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { Coordinate } from './Grid';

export const CELL_SIZE = 60;

const Container = styled.div`
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  border: 1px dashed #777;
  margin: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`;

interface CellProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const Cell: React.FC<CellProps> = ({ mouseX, mouseY }) => {
  const [position, setPosition] = useState<Coordinate>([0, 0]);
  const ref = useRef<HTMLDivElement>(null);

  const direction = useTransform([mouseX, mouseY], ([newX, newY]) => {
    const diffY = (newY as number) - position[1];
    const diffX = (newX as number) - position[0];
    const angleRadians = Math.atan2(diffY, diffX);
    const angleDegrees = Math.floor(angleRadians * (180 / Math.PI));
    return angleDegrees;
  });

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

  return (
    <Container ref={ref}>
      <motion.div style={{ pointerEvents: 'none', rotate: direction }}>
        →
      </motion.div>
    </Container>
  );
};

export default Cell;
