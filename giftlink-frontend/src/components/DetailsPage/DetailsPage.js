import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

export default function DetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const comments = [
    { author: 'John Doe', comment: 'I would like this!' },
    { author: 'Jane Smith', comment: 'Just DMed you.' },
    { author: 'Alice Johnson', comment: "I will take it if it's still available." },
    { author: 'Mike Brown', comment: 'This is a good one!' },
    { author: 'Sarah Wilson', comment: 'My family can use one. DM me if it is still available. Thank you!' }
  ];

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const response = await fetch(
          `${urlConfig.backendUrl}/api/gifts/${encodeURIComponent(productId)}`
        );
        if (!response.ok) throw new Error('Gift not found');
        setGift(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGift();
    window.scrollTo(0, 0);
  }, [productId]);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5">Error: {error}</div>;
  if (!gift) return <div className="container mt-5">Gift not found</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)}>Back</button>

      <div className="card product-details-card">
        <div className="card-header">
          <h2 className="details-title">{gift.name}</h2>
        </div>
        <div className="card-body">
          <div className="image-placeholder-large">
            {gift.image ? (
              <img src={gift.image} alt={gift.name}
                className="img-fluid" style={{ maxHeight: 360 }} />
            ) : (
              <div>No Image Available</div>
            )}
          </div>
          <p><strong>Category:</strong> {gift.category}</p>
          <p><strong>Condition:</strong> {gift.condition}</p>
          <p><strong>Date Added:</strong> {gift.date_added}</p>
          <p><strong>Age (Years):</strong> {gift.age_years}</p>
          <p><strong>Description:</strong> {gift.description}</p>
        </div>
      </div>

      <div className="comments-section mt-4">
        <h3>Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <p><strong>{comment.author}:</strong></p>
              <p>{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
