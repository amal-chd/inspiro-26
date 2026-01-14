import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import MoreInfo from './pages/MoreInfo';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Rules from './pages/Rules';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Scanner from './pages/Scanner';


import Results from './pages/Results';
import Champions from './pages/Champions';
import Verify from './pages/Verify';

import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/Preloader';
import UpsideDownToggle from './components/UpsideDownToggle';
import { AnimatePresence } from 'framer-motion';
import { NotificationProvider } from './components/NotificationProvider';

import heroVideo from './assets/hero-video.mp4';
import jumpscareFace from './assets/jumpscare_face.jpg';
import jumpscareAudio from './assets/jumpscare.ogg';

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Preloading Logic
    const loadAssets = async () => {
      let videoProgress = 0;
      let assetsLoaded = 0;


      const updateProgress = () => {
        // Video is 80% of the weight, others are 10% each
        const total = (videoProgress * 0.8) + ((assetsLoaded / 2) * 20);
        setProgress(Math.min(100, total));
      };

      // 1. Fetch Video with Progress (Biggest Asset ~6MB)
      const videoPromise = new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', heroVideo, true);
        xhr.responseType = 'blob';

        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            videoProgress = (event.loaded / event.total) * 100;
            updateProgress();
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            videoProgress = 100;
            updateProgress();
            // We rely on browser cache for the actual video element later, 
            // or we could use URL.createObjectURL(xhr.response) if needed.
            // For now, caching is cleaner than passing blobs through router.
            resolve();
          } else {
            resolve(); // Proceed even if fail
          }
        };

        xhr.onerror = () => resolve();
        xhr.send();
      });

      // 2. Load Jumpscare Image
      const imagePromise = new Promise(resolve => {
        const img = new Image();
        img.src = jumpscareFace;
        img.onload = () => {
          assetsLoaded++;
          updateProgress();
          resolve();
        };
        img.onerror = () => {
          assetsLoaded++; // Count as done to avoid hanging
          resolve();
        };
      });

      // 3. Load Audio
      const audioPromise = new Promise(resolve => {
        const audio = new Audio(jumpscareAudio);
        audio.oncanplaythrough = () => {
          assetsLoaded++;
          updateProgress();
          resolve();
        };
        audio.onerror = () => {
          assetsLoaded++;
          resolve();
        };
        // Fallback for audio timeout
        setTimeout(() => {
          if (assetsLoaded < 2) {
            // If purely audio hanging, we proceed
            resolve();
          }
        }, 3000);
      });

      // Minimum time to show the cool loader (2.5s)
      const minTimePromise = new Promise(resolve => setTimeout(resolve, 2500));

      await Promise.all([videoPromise, imagePromise, audioPromise, minTimePromise]);

      setProgress(100);
      setTimeout(() => setLoading(false), 500); // Short buffer at 100%
    };

    loadAssets();

    return () => {
      lenis.destroy();
    };
  }, []);



  return (
    <NotificationProvider>
      <Router>
        <AnimatePresence mode="wait">
          {loading && <Preloader progress={progress} />}
        </AnimatePresence>

        {!loading && (
          <div id="main-content" className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary selection:text-white transition-all duration-1000">
            <div className="film-grain"></div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/episodes" element={<Episodes />} />
              <Route path="/more-info" element={<MoreInfo />} />
              <Route path="/register" element={<Register />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/rules/:eventId" element={<Rules />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<Admin />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/results" element={<Results />} />
              <Route path="/champions" element={<Champions />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </div>
        )}
        <UpsideDownToggle />
      </Router>
    </NotificationProvider>
  );
}

export default App;
