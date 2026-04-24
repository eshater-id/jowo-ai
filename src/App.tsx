/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import ImageGenerator from './pages/ImageGenerator';
import VideoGenerator from './pages/VideoGenerator';
import HistoryPage from './pages/History';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate-image" element={<ImageGenerator />} />
          <Route path="/generate-video" element={<VideoGenerator />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
