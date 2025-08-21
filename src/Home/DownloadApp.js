import React from 'react';
import './DownloadApp.css';

function DownloadApp() {
  return (
    <section className="download-app-section">
      <div className="container">
        <div className="download-content">
          <h2>Download Our App</h2>
          <p>
            Get the full pet care experience on your mobile device. Order pet supplies, book services,
            and find adoption opportunities all in one place.
          </p>
          <div className="app-buttons">
            <a href="#" className="app-store-btn">
              <img src="https://via.placeholder.com/150x50?text=App+Store" alt="App Store" />
            </a>
            <a href="#" className="google-play-btn">
              <img src="https://via.placeholder.com/150x50?text=Google+Play" alt="Google Play" />
            </a>
          </div>
        </div>
        <div className="download-app-image">
          <img src="https://via.placeholder.com/400x450?text=Phone+App" alt="Pet Lover App on Phone" />
        </div>
      </div>
    </section>
  );
}

export default DownloadApp;