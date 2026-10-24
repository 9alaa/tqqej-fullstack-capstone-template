import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3060';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      setMessage(data.message || 'Registration failed');
      if (response.ok) navigate('/login');
    } catch {
      setMessage('Unable to connect to the server');
    }
  };

  return (
    <main className="container py-5">
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" name="name" placeholder="Name"
          value={form.name} onChange={handleChange} required />
        <input className="form-control my-2" name="email" type="email"
          placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="form-control my-2" name="password" type="password"
          placeholder="Password" value={form.password} onChange={handleChange} required />
        <button className="btn btn-primary mt-2" type="submit">Register</button>
      </form>
      <p className="mt-3">{message}</p>
      <Link to="/login">Already registered? Log in</Link>
    </main>
  );
}
