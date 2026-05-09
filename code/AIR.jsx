import React, { useEffect, useState } from 'react';
import './style.css'; // Assuming you have the CSS in a separate file

const AIR = () => {
    const [theme, setTheme] = useState('dark');
    const [loading, setLoading] = useState(true);
    const [typedText, setTypedText] = useState('');
    const [stats, setStats] = useState({ destinations: 0, onTime: 0, flyers: 0 });

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 2200);

        // Typing animation
        const words = ['IMAGINATION', 'HORIZONS', 'LIMITS', 'TOMORROW'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                setTypedText(currentWord.substring(0, charIndex - 1));
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            } else {
                setTypedText(currentWord.substring(0, charIndex + 1));
                charIndex++;
                if (charIndex === currentWord.length) {
                    isDeleting = true;
                }
            }
            setTimeout(type, isDeleting ? 60 : 110);
        };
        setTimeout(type, 1000);

        // Stats animation
        const animateStats = () => {
            setStats({
                destinations: Math.min(stats.destinations + 3.6, 180),
                onTime: Math.min(stats.onTime + 0.196, 98),
                flyers: Math.min(stats.flyers + 0.08, 4)
            });
        };
        const interval = setInterval(animateStats, 30);
        setTimeout(() => clearInterval(interval), 2000);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
    };

    if (loading) {
        return (
            <div id="loader">
                <div className="loader-inner">
                    <div className="loader-plane">✈</div>
                    <div className="loader-brand">NEXUS AIR</div>
                    <div className="loader-bar-wrap">
                        <div className="loader-bar"></div>
                    </div>
                    <div className="loader-text">Preparing your journey...</div>
                </div>
            </div>
        );
    }

    return (
        <div data-theme={theme}>
            {/* Cursor */}
            <div id="cursor-glow"></div>
            <div id="cursor-dot"></div>

            {/* Navbar */}
            <nav id="navbar">
                <div className="nav-container">
                    <a href="#" className="nav-logo">
                        <span className="logo-icon">✈</span>
                        <span className="logo-text">NEXUS AIR</span>
                    </a>
                    <ul className="nav-links">
                        <li><a href="#flights" className="nav-link">Flights</a></li>
                        <li><a href="#destinations" className="nav-link">Destinations</a></li>
                        <li><a href="#services" className="nav-link">Services</a></li>
                        <li><a href="#deals" className="nav-link">Deals</a></li>
                        <li><a href="#contact" className="nav-link">Contact</a></li>
                    </ul>
                    <div className="nav-actions">
                        <button id="theme-toggle" className="theme-btn" onClick={toggleTheme} aria-label="Toggle Theme">
                            <i className={`fas fa-${theme === 'dark' ? 'moon' : 'sun'}`} id="theme-icon"></i>
                        </button>
                        <a href="#" className="nav-cta">Book Now</a>
                        <button className="hamburger" id="hamburger" aria-label="Menu">
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className="mobile-menu" id="mobile-menu">
                    <a href="#flights">Flights</a>
                    <a href="#destinations">Destinations</a>
                    <a href="#services">Services</a>
                    <a href="#deals">Deals</a>
                    <a href="#contact">Contact</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero">
                {/* Sky Background with Stars */}
                <div className="hero-sky">
                    <div className="stars" id="stars"></div>
                    <div className="nebula"></div>
                </div>

                {/* Clouds */}
                <div className="clouds-layer">
                    <div className="cloud cloud-1"></div>
                    <div className="cloud cloud-2"></div>
                    <div className="cloud cloud-3"></div>
                    <div className="cloud cloud-4"></div>
                    <div className="cloud cloud-5"></div>
                </div>

                {/* Flying Airplane */}
                <div className="hero-plane-wrap" id="hero-plane">
                    <div className="plane-body">✈</div>
                    <div className="plane-trail"></div>
                </div>

                {/* Hero Content */}
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot"></span> Premium Class Experience
                    </div>
                    <h1 className="hero-title">
                        <span className="title-line-1">FLY BEYOND</span>
                        <span className="title-line-2 gradient-text" id="typed-text">{typedText}</span>
                    </h1>
                    <p className="hero-subtitle">
                        Where luxury meets the sky. Experience first-class travel reimagined<br />
                        for the future of humanity's greatest journey.
                    </p>
                    <div className="hero-actions">
                        <a href="#flights" className="btn-primary glow-btn">
                            <i className="fas fa-search"></i> Search Flights
                        </a>
                        <a href="#destinations" className="btn-ghost">
                            <i className="fas fa-globe"></i> Explore Routes
                        </a>
                    </div>
                    {/* Hero Stats */}
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-num">{Math.floor(stats.destinations)}</span><span>+</span>
                            <span className="stat-label">Destinations</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-num">{Math.floor(stats.onTime)}</span><span>%</span>
                            <span className="stat-label">On-Time Rate</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-num">{Math.floor(stats.flyers)}</span><span>M+</span>
                            <span className="stat-label">Happy Flyers</span>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-mouse">
                        <div className="scroll-wheel"></div>
                    </div>
                    <span>Scroll to Explore</span>
                </div>
            </section>

            {/* Flight Search */}
            <section id="flights" className="section-search">
                <div className="search-glass">
                    <div className="search-header">
                        <div className="search-tabs">
                            <button className="tab active">One Way</button>
                            <button className="tab">Round Trip</button>
                            <button className="tab">Multi-City</button>
                        </div>
                        <div className="search-class-select">
                            <select>
                                <option>Economy</option>
                                <option>Business</option>
                                <option selected>First Class</option>
                            </select>
                        </div>
                    </div>
                    <div className="search-form">
                        <div className="search-field">
                            <label><i className="fas fa-plane-departure"></i> From</label>
                            <input type="text" placeholder="Departure City" defaultValue="New Delhi (DEL)" className="search-input" />
                        </div>
                        <button className="swap-btn">
                            <i className="fas fa-exchange-alt"></i>
                        </button>
                        <div className="search-field">
                            <label><i className="fas fa-plane-arrival"></i> To</label>
                            <input type="text" placeholder="Destination City" defaultValue="Dubai (DXB)" className="search-input" />
                        </div>
                        <div className="search-field">
                            <label><i className="fas fa-calendar-alt"></i> Departure</label>
                            <input type="date" className="search-input" />
                        </div>
                        <div className="search-field">
                            <label><i className="fas fa-calendar-check"></i> Return</label>
                            <input type="date" className="search-input" />
                        </div>
                        <div className="search-field passenger-field">
                            <label><i className="fas fa-users"></i> Passengers</label>
                            <div className="passenger-picker">
                                <button className="pax-btn minus">−</button>
                                <div className="pax-info">
                                    <span>1</span>
                                    <small>Adults</small>
                                </div>
                                <button className="pax-btn plus">+</button>
                            </div>
                        </div>
                        <button className="search-submit glow-btn">
                            <span className="search-btn-text"><i className="fas fa-search"></i> Search Flights</span>
                        </button>
                    </div>
                    {/* Search Suggestions */}
                    <div className="search-tags">
                        <span className="search-tag-label">Popular:</span>
                        <button className="search-tag">🇫🇷 Paris</button>
                        <button className="search-tag">🇺🇸 New York</button>
                        <button className="search-tag">🇯🇵 Tokyo</button>
                        <button className="search-tag">🇦🇪 Dubai</button>
                        <button className="search-tag">🇮🇹 Rome</button>
                    </div>
                </div>
            </section>

            {/* Note: This is a simplified conversion. The original HTML has many more sections and complex JavaScript functionality.
          To fully replicate, you'd need to add more components and use libraries like GSAP for animations, AOS for scroll animations, etc. */}
        </div>
    );
};

export default AIR;