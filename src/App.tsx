import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Board from './components/Board';
import './output.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='w-full h-full flex flex-row items-center justify-center'>
        <Board />
      </div>
    </DndProvider>
  );
}

export default App;
