const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const API_KEY = 'e09eca98a51207e0f0aa35c174e8e2746bc58072';
const USERNAME = 'abusayeid';
const BASE_URL = 'https://clist.by/api/v1/json/contest/';
const RESOURCE_BASE_URL = 'https://clist.by/api/v1/json/resource/';

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
