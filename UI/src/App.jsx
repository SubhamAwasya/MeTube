import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import SearchResults from "./pages/SearchResults";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import UploadVideo from "./pages/UploadVideo";
import Layout from "./components/Layout.jsx";
import Profile from "./pages/Profile.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";
import NotFound404 from "./pages/NotFound404.jsx";
import LoginSignup from "./pages/LoginSignup.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Profile/:id" element={<Profile />} />
        <Route path="/search" element={<SearchResults />} />
      </Route>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth" element={<LoginSignup />} />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
}

export default App;
