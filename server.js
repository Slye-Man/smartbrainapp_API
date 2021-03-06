const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
   client: 'pg',
   connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: '',
      database: 'smart-brain-database',
   }
});

const app = express();

const database = {
   users: [
      {
         id: '123',
         name: 'John',
         email: 'john@gmail.com',
         password: 'cookies',
         entries: 0,
         joined: new Date()
      },
      {
         id: '124',
         name: 'Sally',
         email: 'sally@gmail.com',
         password: 'bananas',
         entries: 0,
         joined: new Date()
      },
   ],
   login: [
      {
         id: '007',
         hash: '',
         email: 'john@gmail.com'
      }
   ]
}

app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
   res.send(database.users)
});

app.post('/signin', (req, res) => {
   if (req.body.email === database.users[0].email && 
         req.body.password === database.users[0].password) {
            res.json('success')
         } else {
            res.status(400).json('error loggin in');
         }
});

app.post('/register', (req, res) => {
   const { email, name, password } = req.body;
   db('users').insert({
      email: email,
      name: name,
      joined: new Date(),
   }).then(console.log)
   res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
   const { id } = req.params;
   let found = false;
   database.users.forEach(user => {
      if (user.id === id) {
         found = true;
         return res.json(user);
      }
   });
   if (!found) {
      res.status(400).json('such user cannot be found');
   }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
   let found = false;
   database.users.forEach(user => {
      if (user.id === id) {
         found = true;
         user.entries++;
         return res.json(user.entries);
      }
   })
   if(!found) {
      res.status(400).json('such user cannot be found');
   }
})

app.listen(3000, () => {
   console.log('app running on port 3000')
});
