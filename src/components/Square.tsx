import { useDrop } from 'react-dnd';

import Stone from './Stone';
import { ISquare, ItemTypes, Player } from './types';

const Square = ({
  isValidMove,
  isValidJump,
  darkCell,
  hasPlayer,
  x,
  y,
  markStone,
  dropStone,
  stoneLocation,
  currentPlayer
}: ISquare) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => {
    return {
      accept: ItemTypes.STONE,
      drop: () => dropStone(x, y),
      canDrop: () => isValidMove || isValidJump,
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
        isOver: !!monitor.isOver()
      })
    };
  }, [x, y, stoneLocation]);

  return (
    <div
      ref={drop}
      className={`relative flex w-16 h-16 justify-center items-center border ${
        darkCell ? 'bg-black' : 'bg-white'
      }`}
      key={`column-${x}`}
    >
      {darkCell && hasPlayer !== null && (
        <Stone
          currentPlayer={currentPlayer}
          stonePlayer={hasPlayer}
          canMove={true}
          markStone={markStone}
          color={hasPlayer === Player.Player1 ? 'bg-green-500' : 'bg-red-500'}
        />
      )}
      {((isOver && canDrop) || isValidJump) &&
        x !== stoneLocation[0] &&
        y !== stoneLocation[1] && (
          <div className='bg-yellow-200 absolute w-full h-full z-10' />
        )}
      {((isOver && canDrop) || isValidMove) &&
        x !== stoneLocation[0] &&
        y !== stoneLocation[1] && (
          <div className='bg-green-200 absolute w-full h-full z-10' />
        )}
    </div>
  );
};

export default Square;
