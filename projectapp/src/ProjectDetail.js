import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProjectDetail() {
  const { id } = useParams(); // Get the project ID from the route
  const [project, setProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ description: '', date: '', status: 'pending' });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [loading, setLoading] = useState(true); // For loading states
  const [error, setError] = useState(null); // For error handling
  const [editingTodo, setEditingTodo] = useState(null); // Store the todo being edited
  const [updatedDescription, setUpdatedDescription] = useState(''); // Store updated description
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch project details and todos
    axios.get(`http://localhost:8081/projects/${id}`)
      .then(response => {
        setProject(response.data.project);
        setTodos(response.data.todos);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(error => {
        console.error('Error fetching project details:', error);
        setError('Error fetching project details');
        setLoading(false);
      });
  }, [id]);

  const handleTitleChange = (e) => {
    setProject({ ...project, title: e.target.value });
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    axios.put(`http://localhost:8081/projects/${id}`, { title: project.title })
      .then(() => {
        setIsEditingTitle(false);
        alert('Project title updated successfully');
      })
      .catch(error => {
        console.error('Error updating project title:', error);
        alert('Error updating project title');
      });
  };

  const handleNewTodoChange = (e) => {
    setNewTodo({
      ...newTodo,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTodo = () => {
    if (!newTodo.description || !newTodo.date) {
      alert('Please fill in both the description and date.');
      return;
    }

    axios.post(`http://localhost:8081/projects/${id}/todos`, newTodo)
      .then(response => {
        alert(response.data);
        setNewTodo({ description: '', date: '', status: 'pending' });
        // Refresh the todos list
        return axios.get(`http://localhost:8081/projects/${id}`);
      })
      .then(response => {
        setTodos(response.data.todos);
      })
      .catch(error => {
        console.error('Error adding todo:', error);
        alert('Error adding todo');
      });
  };

  const handleTodoUpdate = (todoId, updatedTodo) => {
    axios.put(`http://localhost:8081/todos/${todoId}`, updatedTodo)
      .then(response => {
        alert(response.data);
        // Refresh the todos list
        return axios.get(`http://localhost:8081/projects/${id}`);
      })
      .then(response => {
        setTodos(response.data.todos);
      })
      .catch(error => {
        console.error('Error updating todo:', error);
        alert('Error updating todo');
      });
  };

  const handleTodoDelete = (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      axios.delete(`http://localhost:8081/todos/${todoId}`)
        .then(response => {
          alert(response.data);
          // Refresh the todos list
          return axios.get(`http://localhost:8081/projects/${id}`);
        })
        .then(response => {
          setTodos(response.data.todos);
        })
        .catch(error => {
          console.error('Error deleting todo:', error);
          alert('Error deleting todo');
        });
    }
  };

  const handleTodoStatusUpdate = (todoId, status) => {
    axios.put(`http://localhost:8081/todos/${todoId}/status`, { status })
      .then(response => {
        alert(response.data);
        // Refresh the todos list
        return axios.get(`http://localhost:8081/projects/${id}`);
      })
      .then(response => {
        setTodos(response.data.todos);
      })
      .catch(error => {
        console.error('Error updating todo status:', error);
        alert('Error updating todo status');
      });
  };

  const handleStatusToggle = (todo) => {
    const updatedStatus = todo.status === 'pending' ? 'complete' : 'pending';
    handleTodoStatusUpdate(todo.id, updatedStatus);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo.id);
    setUpdatedDescription(todo.description); // Set the current description in the input field
  };

  const handleSaveTodo = (todoId) => {
    axios.put(`http://localhost:8081/todos/${todoId}`, {
      description: updatedDescription,
      status: todos.find(todo => todo.id === todoId).status // keep the status same
    })
    .then(response => {
      alert(response.data);
      // Refresh the todos list
      return axios.get(`http://localhost:8081/projects/${id}`);
    })
    .then(response => {
      setTodos(response.data.todos);
      setEditingTodo(null); // Stop editing
    })
    .catch(error => {
      console.error('Error updating todo:', error);
      alert('Error updating todo');
    });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='bg-primary vh-100 w-100'>
      <div className='mb-3'>
        <h2>
          {isEditingTitle ? (
            <div className='container'>
              <h2 className='text-light'>Edit Project Title</h2>
              <input
                type="text"
                value={project.title}
                onChange={handleTitleChange}
                className='form-control'
              />
              <button onClick={handleTitleSave} className='btn btn-success mt-2'>Save</button>
              <button onClick={() => setIsEditingTitle(false)} className='btn btn-danger mt-2 ml-2'>Cancel</button>
            </div>
          ) : (
            <>
             <div className='container'>
               <span className='text-light'>{project.title}</span>
               <button onClick={handleTitleEdit} className='btn btn-light m-4'>Edit</button>
             </div>
            </>
          )}
        </h2>
      </div>  

      <div className='mt-4 container'>
        <h4 className='text-light'>Todos</h4>
        <ul className='list-group'>
          {todos.map(todo => (
            <li key={todo.id} className='list-group-item d-flex justify-content-between align-items-center'>
              <div>
                {editingTodo === todo.id ? (
                  <input
                    type="text"
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                    className='form-control'
                  />
                ) : (
                  <>
                    <strong>{todo.description}</strong> - {new Date(todo.created_date).toLocaleDateString()} - 
                    <span className={todo.status === 'complete' ? 'text-success' : 'text-danger'}>
                      {todo.status}
                    </span>
                  </>
                )}
              </div>
              <div className='m-1'>
                {editingTodo === todo.id ? (
                  <>
                    <button onClick={() => handleSaveTodo(todo.id)} className='btn btn-sm btn-success mr-2'>
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className='btn btn-sm btn-danger'>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditTodo(todo)} className='btn btn-sm btn-warning mr-2'>Edit</button>
                    <button onClick={() => handleStatusToggle(todo)} className='btn btn-sm btn-success mr-2'>
                      {todo.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                    </button>
                    <button onClick={() => handleTodoDelete(todo.id)} className='btn btn-sm btn-danger'>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className='mt-4 container'>
        <h4 className='text-light'>Add Todo</h4>
        <div className='form-group'>
          <input
            type="text"
            name="description"
            value={newTodo.description}
            onChange={handleNewTodoChange}
            placeholder='Description'
            className='form-control mb-2'
          />
          <input
            type="date"
            name="date"
            value={newTodo.date}
            onChange={handleNewTodoChange}
            className='form-control mb-2'
          />
          <button onClick={handleAddTodo} className='btn btn-success'>Add Todo</button><br></br>
          <button className='btn btn-secondary mt-4' onClick={() => navigate(-1)}>Back to Projects</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
