const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const usersFile = './users.json';
const jwtSecret = 'your_jwt_secret';

// Load users
const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync(usersFile);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

// Save users
const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync(usersFile, dataJSON);
};

// Signup endpoint
app.post('/signup', (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  const users = loadUsers();

  const existingUser = users.find(user => user.email === email || user.username === username);

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const newUser = {
    id: Date.now().toString(),
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword
  };

  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: '1h' });
  res.status(201).json({ message: 'User created successfully', token });
});

// Signin endpoint
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
  res.status(200).json({ message: 'Signin successful', token });
});

// Profile endpoint
app.get('/profile', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const users = loadUsers();
    const user = users.find(user => user.id === decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(401).json({ error: 'Invalid token.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
