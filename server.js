const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const WebSocket = require('ws');

const app = express();
// Default to 3002 to avoid conflicts with other services (Docker, etc.)
const PORT = process.env.PORT || 3002;
const WS_PORT = 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory storage for health data (in a real app, use a database)
let healthData = [];
let appointments = [];
let userProfile = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    emergencyContact: '+0987654321',
    theme: 'dark' // dark or light
};

// Routes
app.get('/', (req, res) => {
    res.render('index', { healthData });
});

app.get('/monitor', (req, res) => {
    res.render('monitor', { healthData });
});

app.get('/appointments', (req, res) => {
    res.render('appointments', { appointments });
});

app.get('/profile', (req, res) => {
    res.render('profile', { userProfile, healthData, appointments: appointments });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { date, weight, bloodPressure, heartRate, steps, sleepHours, spO2, temperature } = req.body;
    const newEntry = {
        id: Date.now(),
        date,
        weight: parseFloat(weight),
        bloodPressure,
        heartRate: parseInt(heartRate),
        steps: parseInt(steps),
        sleepHours: parseFloat(sleepHours),
        spO2: parseFloat(spO2),
        temperature: parseFloat(temperature)
    };
    healthData.push(newEntry);
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const entry = healthData.find(item => item.id === id);
    if (entry) {
        res.render('edit', { entry });
    } else {
        res.status(404).send('Entry not found');
    }
});

app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { date, weight, bloodPressure, heartRate, steps, sleepHours, spO2, temperature } = req.body;
    const index = healthData.findIndex(item => item.id === id);
    if (index !== -1) {
        healthData[index] = {
            id,
            date,
            weight: parseFloat(weight),
            bloodPressure,
            heartRate: parseInt(heartRate),
            steps: parseInt(steps),
            sleepHours: parseFloat(sleepHours),
            spO2: parseFloat(spO2),
            temperature: parseFloat(temperature)
        };
        res.redirect('/');
    } else {
        res.status(404).send('Entry not found');
    }
});

app.post('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    healthData = healthData.filter(item => item.id !== id);
    broadcastUpdate();
    res.redirect('/');
});

// Appointments routes
app.post('/appointments', (req, res) => {
    const { doctor, date, time, reason } = req.body;
    const newAppointment = {
        id: Date.now(),
        doctor,
        date,
        time,
        reason,
        status: 'scheduled'
    };
    appointments.push(newAppointment);
    res.redirect('/appointments');
});

app.post('/appointments/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    appointments = appointments.filter(apt => apt.id !== id);
    res.redirect('/appointments');
});

// Profile routes
app.post('/profile', (req, res) => {
    const { name, email, phone, emergencyContact, theme } = req.body;
    userProfile = { ...userProfile, name, email, phone, emergencyContact, theme };
    res.redirect('/profile');
});

// IoT Data API Endpoint
app.post('/api/iot-data', (req, res) => {
    const { deviceId, heartRate, spO2, temperature, bloodPressure } = req.body;

    // Validate data
    if (!deviceId || !heartRate || !spO2 || !temperature || !bloodPressure) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new entry
    const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        weight: 0, // Placeholder, not provided by IoT
        bloodPressure,
        heartRate: parseInt(heartRate),
        steps: 0, // Placeholder
        sleepHours: 0, // Placeholder
        spO2: parseFloat(spO2),
        temperature: parseFloat(temperature),
        source: 'iot'
    };

    healthData.push(newEntry);
    broadcastUpdate();
    res.json({ success: true, entry: newEntry });
});

// WebSocket Server for real-time updates (disabled on Vercel)
let clients = new Set();

if (process.env.NODE_ENV !== 'production') {
    const wss = new WebSocket.Server({ port: WS_PORT });

    wss.on('connection', (ws) => {
        clients.add(ws);
        console.log('WebSocket client connected');

        ws.on('close', () => {
            clients.delete(ws);
            console.log('WebSocket client disconnected');
        });
    });
}

function broadcastUpdate() {
    const message = JSON.stringify({ type: 'dataUpdate', data: healthData });
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Start servers
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP Server is running on http://localhost:${PORT}`);
    console.log(`WebSocket Server is running on ws://localhost:${WS_PORT}`);
}).on('error', (err) => {
    console.error('Failed to start HTTP server:', err);
    process.exit(1);
});
