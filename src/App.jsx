import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KanbanProvider } from './context/KanbanContext';
import Layout from './components/Layout';
import Board from './pages/Board';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <KanbanProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Board />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </KanbanProvider>
  );
}

export default App;
