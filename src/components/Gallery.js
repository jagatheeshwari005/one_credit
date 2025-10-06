import React from 'react';
import './Gallery.css';

const Gallery = ({ images = [] }) => {
  if (!images || images.length === 0) return null;

  return (
    <section className="gallery-section">
      <div className="container">
        <h2 className="section-title">Gallery</h2>
        <p className="section-subtitle">Moments from our recent events</p>
        <div className="gallery-grid">
          {images.map((img, idx) => (
            <div className="gallery-item" key={idx}>
              <img src={img.src} alt={img.alt || `gallery-${idx}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;