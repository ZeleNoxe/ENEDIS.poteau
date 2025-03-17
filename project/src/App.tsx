import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WelcomePage } from './pages/WelcomePage';
import { PolesPage } from './pages/PolesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/poles" element={<PolesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;