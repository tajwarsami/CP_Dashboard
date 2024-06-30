const express = require('express');
const axios = require('axios');
const cors = require('cors');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const { check, validationResult } = require('express-validator');
require('dotenv').config();


const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

const API_KEY = 'e09eca98a51207e0f0aa35c174e8e2746bc58072';
const USERNAME = 'abusayeid';
const BASE_URL = 'https://clist.by/api/v1/json/contest/';
const RESOURCE_BASE_URL = 'https://clist.by/api/v1/json/resource/';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'contest_tracker'
};

// app.post('/api/signup/', async(req, res)=>{
//     const {username, password} = req.body;
//         try {

//             const connection = await mysql.createConnection(dbConfig);

//             const [existingUser] = await connection.execute('SELECT id FROM users where username=?', [username]);
//             if (existingUser.length > 0) {
//                 await connection.end();
//                 return res.status(400).json({ msg: 'User already exists' });
//             }

//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(password, salt);

//             await connection.execute('INSERT INTO users (username,password) VALUES(?,?)', [username, password]);
//             await connection.end();
//             res.status(201).json({ msg: 'User created successfully' });
            
//         } catch (error) {
//             res.status(500).json({ error: 'Server error' });
//         }
// })

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    console.log(req.body);

    try {
        const connection = await mysql.createConnection(dbConfig);
        if(connection){
            console.log("connected");
        }
        else{
            console.log("not connected");
        }
        const [existingUser] = await connection.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            await connection.end();
            return res.status(400).json({ msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        await connection.end();
        res.status(201).json({ msg: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async(req, res)=>{
    const {username, password} = req.body;
    try {

        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute('SELECT id, username, password FROM users where username = ?', [username]);

        if (rows.length === 0) {
            await connection.end();
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            await connection.end();
            return res.status(400).json({ msg: 'Wrong Password' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'});

        await connection.end();

        res.json({token});

        
    } catch (error) {
        
    }
})

app.get('/api/contests', async(req, res)=>{
       try {
        const response = await axios.get(BASE_URL, {
            params: {
                'start__gt': new Date().toISOString(),
                'order_by': 'start',
                'username': USERNAME,
                'api_key': API_KEY
            }


        });
        res.json(response.data.objects);
       } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contests' });
       }
});

app.get('/api/contests/:id', async (req, res) => {
     const contestId = req.params.id;

     try {
        const response = await axios.get(`${BASE_URL}${contestId}` , {
            params: {
                'username': USERNAME,
                'api_key': API_KEY
            }
        });

        res.json(response.data);
     } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contest details' });
     }
});

app.get('/api/resources', async (req, res) => {
    try {
        const response = await axios.get('https://clist.by/api/v1/json/resource/', {
            params: {
                'username': USERNAME,
                'api_key': API_KEY
            }
        });
        res.json(response.data.objects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

app.get('/api/resources/:id', async (req, res) => {
    const resourceId = req.params.id;
    try {
        const response = await axios.get(`https://clist.by/api/v1/json/resource/${resourceId}/`, {
            params: {
                'username': USERNAME,
                'api_key': API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resource details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
