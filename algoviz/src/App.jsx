import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './components/ui/Layout';
import SortingVisualizer from './components/sorting/SortingVisualizer';
import PathfindingVisualizer from './components/pathfinding/PathfindingVisualizer';
import GraphVisualizer from './components/graph/GraphVisualizer';
import TreeVisualizer from './components/tree/TreeVisualizer';
import SearchingVisualizer from './components/searching/SearchingVisualizer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/sorting" element={<SortingVisualizer />} />
          <Route path="/pathfinding" element={<PathfindingVisualizer />} />
          <Route path="/graph" element={<GraphVisualizer />} />
          <Route path="/tree" element={<TreeVisualizer />} />
          <Route path="/searching" element={<SearchingVisualizer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
