import { useDrag } from 'react-dnd';
import { IStone, ItemTypes } from './types';

const Stone = ({
  canMove,
  color,
  markStone = () => {},
  currentPlayer = undefined,
  stonePlayer = undefined
}: IStone) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.STONE,
      canDrag: () => (stonePlayer ? currentPlayer === stonePlayer : false),
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [currentPlayer, stonePlayer]
  );

  return (
    <span
      ref={drag}
      className={`inline-block border drop-shadow-2xl cursor-grab ${
        isDragging ? 'opacity-5 cursor-grabbing' : ''
      } w-8 h-8 rounded-full translate-x-0 translate-y-0 ${color}`}
      onMouseDown={() =>
        (currentPlayer === stonePlayer && canMove && markStone()) || null
      }
    ></span>
  );
};

export default Stone;
