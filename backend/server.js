const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todousers"
});

// Register route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("Username and password are required");
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json("Error hashing password");
    }

    const sql = `INSERT INTO login (username, password) VALUES (?, ?)`;
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json("Error registering user");
      }
      res.json("User registered successfully");
    });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("Username and password are required");
  }

  const sql = "SELECT * FROM login WHERE username = ?";
  db.query(sql, [username], (err, data) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json("Error");
    }

    if (data.length > 0) {
      const user = data[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json("Error");
        }
        if (result) {
          return res.json("Login Successfully");
        } else {
          return res.status(401).json("Invalid credentials");
        }
      });
    } else {
      return res.status(401).json("Invalid credentials");
    }
  });
});

// Add new project route
app.post('/projects', (req, res) => {
  const { projectName } = req.body;
  const sql = "INSERT INTO projects (title) VALUES (?)";
  db.query(sql, [projectName], (err, data) => {
    if (err) {
      console.error("Error adding project:", err);
      return res.status(500).json("Error adding project");
    }
    return res.json("Project added successfully");
  });
});

// Delete a project
app.delete('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const sql = `DELETE FROM projects WHERE id = ?`;

  db.query(sql, [projectId], (err, data) => {
    if (err) {
      console.error("Error deleting project:", err);
      return res.status(500).json("Error deleting project");
    }

    res.json("Project deleted successfully");
  });
});

// Get all projects route
app.get('/projects', (req, res) => {
  const sql = "SELECT * FROM projects";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json("Error fetching projects");
    }
    return res.json(data);
  });
});

// Fetch a specific project by ID with todos
app.get('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const sql = `SELECT * FROM projects WHERE id = ?`;
  const sqlTodos = `SELECT * FROM todos WHERE project_id = ?`;

  db.query(sql, [projectId], (err, projectData) => {
    if (err) {
      console.error("Error fetching project:", err);
      return res.status(500).json("Error fetching project");
    }

    if (projectData.length > 0) {
      db.query(sqlTodos, [projectId], (err, todosData) => {
        if (err) {
          console.error("Error fetching todos:", err);
          return res.status(500).json("Error fetching todos");
        }

        res.json({ project: projectData[0], todos: todosData });
      });
    } else {
      res.status(404).json("Project not found");
    }
  });
});

// Update project title
app.put('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const { title } = req.body;
  const sql = `UPDATE projects SET title = ? WHERE id = ?`;

  db.query(sql, [title, projectId], (err, data) => {
    if (err) {
      console.error("Error updating project title:", err);
      return res.status(500).json("Error updating project title");
    }

    res.json("Project title updated successfully");
  });
});

// Add a new todo to a project
app.post('/projects/:id/todos', (req, res) => {
  const projectId = req.params.id;
  const { description, status } = req.body;

  if (!description || !status) {
    return res.status(400).json("Description and status are required");
  }

  const createdDate = new Date();
  const updatedDate = createdDate;

  const sql = `
    INSERT INTO todos (description, status, created_date, updated_date, project_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [description, status, createdDate, updatedDate, projectId], (err, data) => {
    if (err) {
      console.error("Error adding todo:", err);
      return res.status(500).json("Error adding todo");
    }

    res.json("Todo added successfully");
  });
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const { description, status } = req.body;
  
  const sql = `UPDATE todos SET description = ?, status = ? WHERE id = ?`;

  db.query(sql, [description, status, todoId], (err, data) => {
    if (err) {
      console.error("Error updating todo:", err);
      return res.status(500).json("Error updating todo");
    }

    res.json("Todo updated successfully");
  });
});

// Update todo status
app.put('/todos/:id/status', (req, res) => {
  const todoId = req.params.id;
  const { status } = req.body; // Expecting status to be 'pending' or 'complete'
  const sql = `UPDATE todos SET status = ? WHERE id = ?`;

  db.query(sql, [status, todoId], (err, data) => {
    if (err) {
      console.error("Error updating todo status:", err);
      return res.status(500).json("Error updating todo status");
    }

    res.json("Todo status updated successfully");
  });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const sql = `DELETE FROM todos WHERE id = ?`;

  db.query(sql, [todoId], (err, data) => {
    if (err) {
      console.error("Error deleting todo:", err);
      return res.status(500).json("Error deleting todo");
    }

    res.json("Todo deleted successfully");
  });
});


app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
