import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './Login';

const UserTaskCrud = () => {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    domicilio: '',
    celular: '',
    documento: '',
    rol: '',
    area: ''
  });
  const [taskData, setTaskData] = useState({ name: '', description: '', user: '' });
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://test-kappa-blue.vercel.app/api/user');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const fetchTasks = async () => {
    try {
      const response = await fetch('https://test-kappa-blue.vercel.app/api/task');
      const data = await response.json();
      setTasks(data); // Asegúrate de que esta estructura coincida con la que devuelve tu backend
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (isEditingUser) {
      await updateUser(selectedUser._id, formData);
    } else {
      await createUser(formData);
    }
    fetchUsers();
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      domicilio: '',
      celular: '',
      documento: '',
      rol: '',
      area: ''
    });
    setIsEditingUser(false);
  };
  
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (isEditingTask) {
      await updateTask(selectedTask._id, taskData);
    } else {
      await createTask(taskData);
    }
    fetchTasks();
    setTaskData({ name: '', description: '', user: '' });
    setIsEditingTask(false);
  };
  
  const createTask = async (taskData) => {
    try {
      const response = await fetch('https://test-kappa-blue.vercel.app/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      return data; // Asegúrate de que el backend devuelve la tarea creada
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  const updateTask = async (id, taskData) => {
    try {
      const response = await fetch(`https://test-kappa-blue.vercel.app/api/task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      return data; // Asegúrate de que el backend devuelve la tarea actualizada
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  const deleteTask = async (id) => {
    try {
      await fetch(`https://test-kappa-blue.vercel.app/api/task/${id}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  const createUser = async (userData) => {
    try {
      const response = await fetch('https://test-kappa-blue.vercel.app/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response.json();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  const updateUser = async (id, userData) => {
    try {
      const response = await fetch(`https://test-kappa-blue.vercel.app/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response.json();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  const deleteUser = async (id) => {
    try {
      await fetch(`https://test-kappa-blue.vercel.app/api/user/${id}`, {
        method: 'DELETE',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  const handleEditUser = (user) => {
    setFormData({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      domicilio: user.domicilio || '',
      celular: user.celular || '',
      documento: user.documento || '',
      rol: user.rol || '',
      area: user.area || '',
    });
    setSelectedUser(user);
    setIsEditingUser(true);
  };
  
  const handleEditTask = (task) => {
    setTaskData({
      name: task.name || '',
      description: task.description || '',
      user: task.user ? task.user._id : '', // Asegúrate de acceder al ID del usuario
    });
    setSelectedTask(task);
    setIsEditingTask(true);
  };
  
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white p-4">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h3 mb-0">User and Task Management</h1>
              <div className="d-flex align-items-center">
                <span className="me-3">
                  <i className="bi bi-person-circle me-2"></i>
                  {user.name}
                </span>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            <ul className="nav nav-pills mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  <i className="bi bi-people me-2"></i>
                  Users
                </button>
              </li>
              <li className="nav-item ms-2">
                <button 
                  className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tasks')}
                >
                  <i className="bi bi-list-task me-2"></i>
                  Tasks
                </button>
              </li>
            </ul>

            {activeTab === 'users' && (
              <div className="fade show">
                <div className="row">
                  <div className="col-md-4">
                    <div className="card shadow-sm">
                      <div className="card-header bg-white">
                        <h5 className="card-title mb-0">
                          {isEditingUser ? 'Edit User' : 'Create User'}
                        </h5>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleSubmitUser}>
                          <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter first name"
                              value={formData.firstname}
                              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter last name"
                              value={formData.lastname}
                              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Domicilio</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter domicilio"
                              value={formData.domicilio}
                              onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Celular</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter celular"
                              value={formData.celular}
                              onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Documento</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter documento"
                              value={formData.documento}
                              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Rol</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter rol"
                              value={formData.rol}
                              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Area</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter area"
                              value={formData.area}
                              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            />
                          </div>
                          <button type="submit" className="btn btn-primary">
                            {isEditingUser ? 'Update User' : 'Create User'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td>{user.firstname} {user.lastname}</td>
                              <td>{user.email}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEditUser(user)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteUser(user._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="fade show">
                <div className="row">
                  <div className="col-md-4">
                    <div className="card shadow-sm">
                      <div className="card-header bg-white">
                        <h5 className="card-title mb-0">
                          {isEditingTask ? 'Edit Task' : 'Create Task'}
                        </h5>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleSubmitTask}>
                          <div className="mb-3">
                            <label className="form-label">Task Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter task name"
                              value={taskData.name}
                              onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                              className="form-control"
                              placeholder="Enter description"
                              value={taskData.description}
                              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                              required
                            ></textarea>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Assigned User</label>
                            <select
                              className="form-select"
                              value={taskData.user}
                              onChange={(e) => setTaskData({ ...taskData, user: e.target.value })}
                              required
                            >
                              <option value="">Select a user</option>
                              {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                  {user.firstname} {user.lastname}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            {isEditingTask ? 'Update Task' : 'Create Task'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Task</th>
                            <th>Assigned User</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((task) => (
                            <tr key={task._id}>
                              <td>{task.name}</td>
                              <td>
                                {task.user ? `${task.user.firstname} ${task.user.lastname}` : 'Unassigned'}
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleEditTask(task)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteTask(task._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTaskCrud;
