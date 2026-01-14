import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Events from '../components/Events';
import Footer from '../components/Footer';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');

            // Robust scroll helper with retries
            const scrollToElement = (retryCount = 0) => {
                const element = document.getElementById(id);
                if (element) {
                    // Use a slightly longer timeout to ensure layout stability
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                } else if (retryCount < 3) {
                    // Retry if element not found (e.g., dynamic loading)
                    setTimeout(() => scrollToElement(retryCount + 1), 500);
                }
            };

            scrollToElement();
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Events />
            <Footer />
        </>
    );
};

export default Home;
