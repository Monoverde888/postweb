const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the form HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Handle form submission
app.post('/submit-form', async (req, res) => {
    const { context } = req.body;

    if (!context) {
        return res.status(400).send('No context provided');
    }

    try {
        // Post data to the specified destination server
        const response = await axios.post('https://cougar-flying-jennet.ngrok-free.app/query', { context });

        // Extract the response data, assuming the key is 'response'
        const responseData = response.data.response || 'No response key found';
        
        // Render the formatted response HTML
        res.send(`
            <html>
            <head>
                <title>Response</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    h1 { color: #333; }
                    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Response from Server</h1>
                    <pre>${responseData}</pre>
                    <a href="/">Go back</a>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        const errorMessage = error.response ? error.response.data : 'Failed to post data to the destination server';
        res.status(error.response ? error.response.status : 500).send(`
            <html>
            <head>
                <title>Error</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    h1 { color: #d9534f; }
                    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Error</h1>
                    <pre>${errorMessage}</pre>
                    <a href="/">Go back</a>
                </div>
            </body>
            </html>
        `);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
