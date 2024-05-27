import { useState } from 'react';

import Square from './Square';
import { Player, IBoardSquare } from './types';
import Stone from './Stone';
import confetti from '../assets/confetti.gif';

export const ItemTypes = {
  STONE: 'stone'
};

const initState: IBoardSquare[][] = new Array(8)
  .fill(null)
  .map((_, rowIndex) => {
    return new Array(8).fill(null).map((_, columnIndex) => {
      const cellProperties = {
        isEmpty: true
      };
      return (rowIndex + columnIndex) % 2 === 0
        ? {
            ...cellProperties,
            hasPlayer: null,
            darkCell: false
          }
        : {
            ...cellProperties,
            hasPlayer:
              rowIndex < 3
                ? Player.Player1
                : rowIndex > 4
                ? Player.Player2
                : null,
            darkCell: true
          };
    });
  });

const Board = () => {
  const [board, setBoard] = useState<IBoardSquare[][]>(initState);

  const [player, setPlayer] = useState(Player.Player2);
  const [castOut, setCastOut] = useState({
    red: 0,
    green: 0
  });
  const [stoneLocation, setStoneLocation] = useState<number[]>([0, 0]);
  const [hasMoves, setHasMove] = useState<boolean>(true);
  const handleMarkStone = (rowIndex: number, columnIndex: number) => {
    setStoneLocation([columnIndex, rowIndex]);
  };

  const checkForMoves = (
    stoneX: number,
    stoneY: number,
    rowIndex: number,
    columnIndex: number,
    cell: IBoardSquare
  ) => {
    const newRowIndex = player === Player.Player1 ? stoneY + 1 : stoneY - 1;

    const {
      potentialJumpLeft,
      potentialJumpRight,
      potentialLeftMove,
      potentialRightMove
    } = hasValidMoveOrJump(stoneX, stoneY);

    const newRowJump =
      player === Player.Player1 ? newRowIndex + 1 : newRowIndex - 1;

    return {
      isValidJump:
        (potentialJumpLeft &&
          rowIndex === newRowJump &&
          columnIndex === stoneX - 2) ||
        (potentialJumpRight &&
          rowIndex === newRowJump &&
          columnIndex === stoneX + 2),
      isValidMove:
        (`${stoneX - 1}, ${newRowIndex}` === `${columnIndex}, ${rowIndex}` &&
          potentialLeftMove) ||
        (`${stoneX + 1}, ${newRowIndex}` === `${columnIndex}, ${rowIndex}` &&
          potentialRightMove)
    };
  };

  const hasValidMoveOrJump = (
    stoneX: number,
    stoneY: number
  ): {
    potentialJumpLeft: boolean;
    potentialJumpRight: boolean;
    potentialLeftMove: boolean;
    potentialRightMove: boolean;
  } => {
    if (
      (stoneX && stoneY && board?.[stoneY]?.[stoneX]?.hasPlayer === null) ||
      !board?.[stoneY]?.[stoneX]?.darkCell
    ) {
      return {
        potentialJumpLeft: false,
        potentialJumpRight: false,
        potentialLeftMove: false,
        potentialRightMove: false
      };
    }

    const newRowIndex =
      board[stoneY][stoneX].hasPlayer === Player.Player1
        ? stoneY + 1
        : stoneY - 1;

    const potentialLeftMove =
      newRowIndex >= 0 && stoneX - 1 >= 0
        ? board?.[newRowIndex]?.[stoneX - 1]?.hasPlayer === null
        : false;
    const potentialRightMove =
      newRowIndex >= 0 &&
      newRowIndex <= board.length - 1 &&
      stoneX + 1 <= board.length - 1
        ? board?.[newRowIndex]?.[stoneX + 1]?.hasPlayer === null
        : false;

    const newRowJump =
      player === Player.Player1 ? newRowIndex + 1 : newRowIndex - 1;

    const potentialJumpLeft =
      newRowJump >= 0 &&
      newRowJump <= board.length - 1 &&
      board?.[newRowIndex]?.[stoneX - 1]?.hasPlayer !== player &&
      board?.[newRowIndex]?.[stoneX - 1]?.hasPlayer !== null &&
      board?.[newRowJump]?.[stoneX - 2]?.hasPlayer === null;

    const potentialJumpRight =
      newRowJump >= 0 &&
      newRowJump <= board.length - 1 &&
      stoneX + 2 <= board.length - 1 &&
      board?.[newRowIndex]?.[stoneX + 1]?.hasPlayer !== player &&
      board?.[newRowIndex]?.[stoneX + 1]?.hasPlayer !== null &&
      board?.[newRowJump]?.[stoneX + 2]?.hasPlayer === null;

    return {
      potentialJumpLeft,
      potentialJumpRight,
      potentialLeftMove,
      potentialRightMove
    };
  };

  const moveTo = (x: number, y: number, isValidJump: boolean) => {
    const newBoard = board.map((row) => row.map((column) => column));

    if (isValidJump) {
      const castOutPlayer =
        player === Player.Player1 ? Player.Player2 : Player.Player1;
      setCastOut({
        ...castOut,
        [castOutPlayer]: castOut[castOutPlayer] + 1
      });

      const castOutX =
        x < stoneLocation[0] ? stoneLocation[0] - 1 : stoneLocation[0] + 1;
      const castOutY =
        player === Player.Player1 ? stoneLocation[1] + 1 : stoneLocation[1] - 1;

      newBoard[castOutY][castOutX] = {
        ...board[castOutY][castOutX],
        hasPlayer: null
      };
    }

    newBoard[stoneLocation[1]][stoneLocation[0]] = {
      ...board[stoneLocation[1]][stoneLocation[0]],
      hasPlayer: null
    };

    newBoard[y][x] = {
      ...board[y][x],
      hasPlayer: player
    };
    setBoard(newBoard);

    let hasMove = true;

    newBoard.forEach((row, rowIndex) => {
      row.forEach((_, columnIndex) => {
        const {
          potentialJumpLeft,
          potentialJumpRight,
          potentialLeftMove,
          potentialRightMove
        } = hasValidMoveOrJump(columnIndex, rowIndex);

        hasMove =
          !potentialJumpLeft &&
          !potentialJumpRight &&
          !potentialLeftMove &&
          !potentialRightMove;
      });
    });

    setHasMove(hasMove);

    setStoneLocation([]);
    setPlayer((state) =>
      state === Player.Player1 ? Player.Player2 : Player.Player1
    );
  };

  const player1Score = 12 - castOut[Player.Player1];
  const player2Score = 12 - castOut[Player.Player2];

  return (
    <div>
      <div
        className={`flex items-center justify-center text-center m-4 font-bold gap-4`}
      >
        <span>Current Player:</span>
        <span
          className={`capitalize ${
            player === Player.Player1 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          <Stone color={`bg-${player}-500`} />
        </span>
      </div>
      <div className='relative'>
        {board.map((row, rowIndex) => (
          <div className='flex drop-shadow-2xl' key={`row-${rowIndex}`}>
            {row.map((cell: IBoardSquare, columnIndex) => {
              const [stoneX, stoneY] = stoneLocation;

              const { isValidJump, isValidMove } = checkForMoves(
                stoneX,
                stoneY,
                rowIndex,
                columnIndex,
                cell
              );

              return (
                <Square
                  key={`${rowIndex}-${columnIndex}`}
                  hasPlayer={cell.hasPlayer}
                  darkCell={cell.darkCell}
                  x={columnIndex}
                  y={rowIndex}
                  markStone={() => handleMarkStone(rowIndex, columnIndex)}
                  dropStone={(x, y) => moveTo(x, y, isValidJump)}
                  stoneLocation={stoneLocation}
                  currentPlayer={player}
                  isValidMove={isValidMove}
                  isValidJump={isValidJump}
                />
              );
            })}
          </div>
        ))}
        {(player1Score === 0 || player2Score === 0 || !hasMoves) && (
          <div
            style={{
              backgroundImage: `url(${confetti})`
            }}
            className='bg-cover bg-center top-0 absolute w-full h-full bg-white/90 flex justify-center items-center text-2xl font-bold gap-4'
          >
            Winner is:
            {player1Score > 0 && <Stone color={`bg-${Player.Player1}-500`} />}
            {player2Score > 0 && <Stone color={`bg-${Player.Player2}-500`} />}
            {!hasMoves && <Stone color={`bg-${player}-500`} />}
          </div>
        )}
      </div>
      <div className='flex flex-row justify-between m-4'>
        <div className='flex flex-row items-center gap-4'>
          <Stone color={`bg-${Player.Player1}-500`} /> {player1Score}
        </div>
        <div className='flex flex-row gap-4'>
          <Stone color={`bg-${Player.Player2}-500`} /> {player2Score}
        </div>
      </div>
    </div>
  );
};

export default Board;
