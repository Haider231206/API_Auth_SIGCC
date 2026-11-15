// ==========================================
// SERVICIO WEB: Registro y Autenticación con BD
// Evidencia GA7-220501096-AA5-EV01 (Corregida)
// ==========================================

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// ==========================================
// CONEXIÓN A LA BASE DE DATOS MYSQL
// ==========================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Haider231206.', 
    database: 'sigcc_db'
});

// Probar la conexión
db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a la base de datos MySQL (sigcc_db)');
});

// ==========================================
// ENDPOINTS
// ==========================================

// 1. Registro de usuario
app.post('/api/register', (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ status: "error", mensaje: "Usuario y contraseña obligatorios." });
    }

    // Verificar si el usuario ya existe en la BD
    const checkQuery = 'SELECT * FROM usuarios WHERE usuario = ?';
    db.query(checkQuery, [usuario], (err, results) => {
        if (err) return res.status(500).json({ status: "error", mensaje: "Error en el servidor" });
        
        if (results.length > 0) {
            return res.status(400).json({ status: "error", mensaje: "El usuario ya existe." });
        }

        // Insertar el nuevo usuario
        const insertQuery = 'INSERT INTO usuarios (usuario, password) VALUES (?, ?)';
        db.query(insertQuery, [usuario, password], (err, result) => {
            if (err) return res.status(500).json({ status: "error", mensaje: "Error al registrar" });
            
            res.status(201).json({ status: "success", mensaje: "Usuario registrado exitosamente en la BD." });
        });
    });
});

// 2. Inicio de sesión
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ status: "error", mensaje: "Usuario y contraseña obligatorios." });
    }

    // Buscar en la BD si el usuario y contraseña coinciden
    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';
    db.query(query, [usuario, password], (err, results) => {
        if (err) return res.status(500).json({ status: "error", mensaje: "Error en el servidor" });

        if (results.length > 0) {
            res.status(200).json({ status: "success", mensaje: "Autenticación satisfactoria. ¡Bienvenido!" });
        } else {
            res.status(401).json({ status: "error", mensaje: "Error en la autenticación. Datos incorrectos." });
        }
    });
});

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});