import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Homepage() {
  const [projects,setProjects] = useState([]);
  const [newProject,setNewProject] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        alert('An error occurred while fetching projects.');
      });
  }, []);

  const handleAddProject = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/projects', { projectName: newProject })
      .then(response => {
        alert(response.data);
        setNewProject(''); 
        return axios.get('http://localhost:8081/projects');
      })
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error adding project:', error);
        alert('An error occurred while adding the project.');
      });
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      axios.delete(`http://localhost:8081/projects/${projectId}`)
        .then(response => {
          alert(response.data);
          // Fetch the updated list of projects
          return axios.get('http://localhost:8081/projects');
        })
        .then(response => {
          setProjects(response.data);
        })
        .catch(error => {
          console.error('Error deleting project:', error);
          alert('An error occurred while deleting the project.');
        });
    }
  };

  return (
    <div className='bg-primary vh-100'>
      <div className='container'>
        <h3 className='text-white p-4'>Welcome to the Homepage!</h3>
        <form onSubmit={handleAddProject}>
          <div className='mb-3'>
            <label htmlFor="newProjectTitle" className='form-label text-white'>New Project</label>
            <input 
              type="text" 
              id="newProjectTitle" 
              value={newProject}
              onChange={e => setNewProject(e.target.value)}
              placeholder='Enter new project title' 
              className='form-control' 
            />
          </div>
          <button type="submit" className='btn btn-success'>Add Project</button>
        </form>

        <div className='mt-4'>
          <h4 className='text-white'>Projects List:</h4>
          {projects.length > 0 ? (
            <ul className='list-group'>
              {projects.map(project => (
                <li key={project.id} className='list-group-item'>
                  <Link to={`/projects/${project.id}`}>
                  <strong>{project.title}</strong></Link> - Created on: {new Date(project.created_date).toLocaleDateString()}
                  <button 
                    onClick={() => handleDeleteProject(project.id)} 
                    className='btn btn-danger btn-sm float-end'
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : ( 
            <p className='text-white'>No projects found. Add a new project to get started!</p>
          )}
        </div>
      </div>
    </div>  
    
  )
}

export default Homepage