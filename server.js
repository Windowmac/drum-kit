  
const express = require('express');
const PORT = process.env.PORT || 3030;
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile('/index.html');
})

app.listen(PORT, () => console.log('listening on: ', PORT));