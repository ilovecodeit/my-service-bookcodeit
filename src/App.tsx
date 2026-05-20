import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ResourceDetail from './pages/ResourceDetail';
import MyBookings from './pages/MyBookings';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
        <Header />
        <main className="flex-grow max-w-[1280px] w-full mx-auto px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail" element={<ResourceDetail />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
