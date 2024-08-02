const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles'); // Importar rutas de roles
const weatherRoutes = require('./routes/weather'); // Importar rutas de clima

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes); // Usar rutas de roles
app.use('/api/weather', weatherRoutes); // Usar rutas de clima

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error(err);
});
