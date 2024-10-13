import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ImageGalleryApp.module.css'; // Import updated CSS module

const ImageGalleryApp = () => {
  const accessKey = 'RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw'; // Unsplash API access key
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchImages = async (pageNum, query = '') => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: query || 'random',
          page: pageNum,
          client_id: accessKey,
        },
      });
      setLoading(false);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to fetch images. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const data = await fetchImages(1, searchQuery);
      if (data) {
        setImages(data);
        setPage(2);
        setShowMore(data.length === 10);
      }
    };
    loadImages();
  }, [searchQuery]);

  const handleLoadMore = async () => {
    const data = await fetchImages(page, searchQuery);
    if (data) {
      setImages((prevImages) => [...prevImages, ...data]);
      setPage(page + 1);
      setShowMore(data.length === 10);
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderImageElements = () => {
    return images.map((image) => (
      <div key={image.id} className={styles.imageItem}>
        <div className={styles.imageContainer}>
          <img
            src={image.urls.small}
            alt={image.alt_description}
            className={styles.image}
          />
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.description}>
          <a
            href={image.links.html}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.imageLink}
          >
            {image.alt_description || 'View Image'}
          </a>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <h1 className={styles.title}>Geek Gallery</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for images..."
          className={styles.searchInput}
        />
      </div>


      <div className={styles.galleryWrapper}>
        {loading && <div className={styles.loading}>Loading...</div>}

        <div className={styles.imageGrid}>
          {images.length > 0 ? renderImageElements() : !loading && <p>No results found.</p>}
        </div>

        {showMore && (
          <div className={styles.showMoreWrapper}>
            <button
              onClick={handleLoadMore}
              className={styles.showMoreButton}
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className={styles.scrollTopButton}
        >
          ⬆️ 
        </button>
      )}
    </div>
  );
};

export default ImageGalleryApp;
