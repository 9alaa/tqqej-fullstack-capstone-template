import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [age, setAge] = useState(20);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
  const conditions = ['New', 'Like New', 'Older'];

  const searchGifts = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.name) params.set('name', filters.name);
      if (filters.category) params.set('category', filters.category);
      if (filters.condition) params.set('condition', filters.condition);
      if (filters.age_years !== undefined) {
        params.set('age_years', filters.age_years);
      }
      const response = await fetch(
        `${urlConfig.backendUrl}/api/search?${params.toString()}`
      );
      if (!response.ok) throw new Error('Search failed');
      setResults(await response.json());
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${urlConfig.backendUrl}/api/gifts`);
        if (!response.ok) throw new Error('Unable to load gifts');
        setResults(await response.json());
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, []);

  const handleSearch = () => searchGifts({
    name: query,
    category,
    condition,
    age_years: age
  });

  return (
    <div className="container mt-5">
      <h1>Search Gifts</h1>
      <div className="filter-section mb-4 p-3 border rounded">
        <label className="form-label">Category</label>
        <select className="form-select mb-3" value={category}
          onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className="form-label">Condition</label>
        <select className="form-select mb-3" value={condition}
          onChange={e => setCondition(e.target.value)}>
          <option value="">All Conditions</option>
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className="form-label">Maximum Age: {age} years</label>
        <input className="form-range mb-3" type="range"
          min="0" max="20" value={age}
          onChange={e => setAge(Number(e.target.value))} />

        <input className="form-control mb-3"
          placeholder="Search by gift name"
          value={query} onChange={e => setQuery(e.target.value)} />

        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {results.length === 0 && !error && <p>No gifts found.</p>}

      <div className="row">
        {results.map(gift => (
          <div className="col-md-4 mb-3" key={gift.id || gift._id}>
            <div className="card h-100">
              {gift.image && (
                <img src={gift.image} alt={gift.name}
                  className="card-img-top"
                  style={{ height: 180, objectFit: 'contain' }} />
              )}
              <div className="card-body">
                <h5>{gift.name}</h5>
                <p>{gift.category} — {gift.condition}</p>
                <button className="btn btn-outline-primary"
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
