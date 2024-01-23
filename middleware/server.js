const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', (req, res) => {
    console.log('Received a request:');
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Query Parameters:', req.query);

    if (Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    } else {
        console.log('No body content');
    }

    res.send('SOC Middleware!');
});

app.listen(port, () => {
    console.log(`Middleware service listening at http://localhost:${port}`);
});

