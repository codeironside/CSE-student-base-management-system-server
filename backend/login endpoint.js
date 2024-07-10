const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

//Replace with your database connection logic 
const users = [
  {
    username: 'admin',
    password: 
    'oreoluwaisking', // Hashed password for 'admin'

  },
];
app.post ('/login', async (req, res) => {
    const {username, password} = req.body;
const user = user.find ((u) => u.username === username);
if (!user)return 
res.status(401).send ('invalid username or password')

const validPassword = await
bcrypt. compare(password, user.password);
if (!validpassword) return
res.status (401).send('invalid useername or password');
//Generate JWT token here and send it in the response 
  res.send('Loggged in successfully!');
}
);
app.listen(3000, ()=> console.log('server listening on port 3000'));

