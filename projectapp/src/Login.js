import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/login', { username, password })
      .then(res => {
        if (res.data === "Login Successfully") {
          navigate('/homepage');
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
        <div style={{borderRadius: '5px'}} className='p-3 bg-light w-25'>
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
            <button className='btn btn-success'>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
