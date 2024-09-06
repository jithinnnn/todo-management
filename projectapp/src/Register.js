import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    axios.post('http://localhost:8081/register', { username, password })
      .then(res => {
        if (res.data === "User registered successfully") {
          alert("Registration successful! Please login.");
          navigate('/login');
        } else {
          alert(res.data);
        }
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred. Please try again.');
      });
  }

  return (
    <div>
      <div className='d-flex vh-100 justify-content-center align-items-center bg-primary'>
        <div style={{ borderRadius: '5px' }} className='p-3 bg-light w-25'>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                onChange={e => setUsername(e.target.value)} 
                placeholder='Enter Username' 
                className='form-control' 
                required 
              />
            </div>
            <div className='mb-3'>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                onChange={e => setPassword(e.target.value)} 
                placeholder='Enter Password' 
                className='form-control' 
                required 
              />
            </div>
            <div className='mb-3'>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder='Confirm Password' 
                className='form-control' 
                required 
              />
            </div>
            <button className='btn btn-success'>Register</button>
            <Link to={`/login`}><button className='m-1 btn btn-primary'>Go to Login</button></Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
