
require('dotenv').config();
const express = require('express');
const DBCon = require('./app/config/db')
const cors = require('cors')



const app = express();

DBCon();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended : true}));

const router = require('./app/routes');
app.use(router);

app.get('/', (req, res) => {
    res.send('Welcome to RBAC production level project');
});

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server is listing on PORT ${PORT}`);
    
});
