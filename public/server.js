// server.js

const express = require('express');
const bodyParser = require('body-parser'); 

const app = express();
const port = 3000;

// Middleware Setup
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


function calculateAndCategorizeBMI(weight, height) {
    const bmi = weight / Math.pow(height, 2); 

    let category = '';
    let color = ''; 

    // Category
    if (bmi < 18.5) {
        category = 'Underweight';
        color = 'blue';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal weight';
        color = 'green';
    } else if (bmi >= 24.9 && bmi < 29.9) {
        category = 'Overweight';
        color = 'yellow';
    } else { 
        category = 'Obese';
        color = 'red';
    }

    return {
        bmi: parseFloat(bmi.toFixed(2)),
        category: category,
        color: color
    };
}


// Routes

// GET
app.get('/', (req, res) => {
    const formHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BMI Calculator</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <div class="container">
                <h1>Body Mass Index (BMI) Calculator</h1>
                <form action="/calculate-bmi" method="POST">
                    <label for="weight">Weight (kg):</label>
                    <input type="number" id="weight" name="weight" step="0.01" required min="1" placeholder="e.g., 70.5">
                    
                    <label for="height">Height (m):</label>
                    <input type="number" id="height" name="height" step="0.01" required min="0.1" placeholder="e.g., 1.75">
                    
                    <button type="submit">Calculate BMI</button>
                </form>
            </div>
        </body>
        </html>
    `;
    res.send(formHtml);
});

// POST
app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    // Input
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Input Error</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="container">
                    <h1>Error!</h1>
                    <p class="error-message">Invalid input. Please ensure both weight and height are positive numbers.</p>
                    <a href="/">Go Back to Calculator</a>
                </div>
            </body>
            </html>
        `);
    }

    const { bmi, category, color } = calculateAndCategorizeBMI(weight, height);

    // HTML
    const resultHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BMI Result</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <div class="container">
                <h1>BMI Calculation Result</h1>
                <p>Weight: **${weight} kg**</p>
                <p>Height: **${height} m**</p>
                <hr>
                <h2>Your BMI is: ${bmi}</h2>
                <h3 class="result-category ${color}">Category: ${category}</h3>
                
                <a href="/">Calculate Another BMI</a>
            </div>
        </body>
        </html>
    `;

    res.send(resultHtml);
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});