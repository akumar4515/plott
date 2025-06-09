import React from "react";
import { Link } from "react-router-dom";
import "../css/main.css";
import logo from "../assets/logo.png"; // Existing logo
import uploadIcon from "../assets/upload.svg"; // New icon for Easy Upload
import chartTypesIcon from "../assets/chart.svg"; // New icon for Multiple Chart Types
import controlsIcon from "../assets/controls.svg"; // New icon for Interactive Controls

export const Main = () => {
  return (
    <div className="main-container">
      {/* Header */}
      <header className="header animate-slide-in">
        <div className="container header-content">
          <div className="header-logo-title">
            <img src={logo} alt="Graphix Logo" className="header-logo" />
            <h1 className="header-title">Graphix</h1>
          </div>
          <nav className="nav">
            <Link to="/plot" className="nav-link">Plot Data</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section animate-fade-in">
        <div className="container">
          <h2 className="hero-title animate-scale-in">Visualize Your Data</h2>
          <p className="hero-description animate-fade-in-delay">
            Graphix is a powerful web application that lets you upload CSV or Excel files and create interactive charts like bar, pie, scatter, line, and donut in just a few clicks.
          </p>
          <div className="hero-cta">
            <Link to="/plot" className="cta-button animate-pulse">Start Plotting Now</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section animate-fade-in">
        <div className="container">
          <h2 className="section-title">Why Choose Graphix?</h2>
          <div className="features-grid">
            <div className="feature-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <img src={uploadIcon} alt="Easy Upload Icon" className="feature-icon" />
              <h3 className="feature-title">Easy Upload</h3>
              <p className="feature-description">
                Upload your CSV or Excel files effortlessly and start visualizing instantly.
              </p>
            </div>
            <div className="feature-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <img src={chartTypesIcon} alt="Chart Types Icon" className="feature-icon" />
              <h3 className="feature-title">Multiple Chart Types</h3>
              <p className="feature-description">
                Choose from bar, pie, scatter, line, or donut charts to best represent your data.
              </p>
            </div>
            <div className="feature-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <img src={controlsIcon} alt="Interactive Controls Icon" className="feature-icon" />
              <h3 className="feature-title">Interactive Controls</h3>
              <p className="feature-description">
                Customize your charts by selecting X and Y axes and switching chart types on the fly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer animate-fade-in">
        <div className="container">
          <span className="footer-text">Graphix</span>
          <span className="footer-text">2023</span>
        </div>
      </footer>
    </div>
  );
};