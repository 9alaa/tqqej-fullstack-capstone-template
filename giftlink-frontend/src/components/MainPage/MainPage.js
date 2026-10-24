import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

export default function MainPage() {
  const [gifts, setGifts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch(`${urlConfig.backendUrl}/api/gifts`);
        if (!response.ok) throw new Error('Unable to load gifts');
        setGifts(await response.json());
      } catch (err) {
        setError(err.message);
      }
    };
    fetchGifts();
  }, []);

  const formatDate = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleDateString() : 'Not available';

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Available Gifts</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {gifts.map(gift => (
          <div key={gift.id || gift._id} className="col-md-4 mb-4">
            <div className="card product-card h-100">
              {gift.image ? (
                <img src={gift.image} alt={gift.name}
                  className="card-img-top"
                  style={{ height: 220, objectFit: 'contain' }} />
              ) : (
                <div className="p-5 text-center">No Image Available</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{gift.name}</h5>
                <p className="card-text">{gift.category}</p>
                <p className="card-text">Condition: {gift.condition}</p>
                <p className="card-text">
                  Added: {formatDate(gift.date_added)}
                </p>
                <button className="btn btn-primary"
                  onClick={() => navigate(`/app/gifts/${gift.id}`)}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
