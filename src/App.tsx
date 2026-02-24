import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SajdaPage } from './pages/SajdaPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sajda" element={<SajdaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
