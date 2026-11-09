// ==========================================
// SERVICIO WEB: Registro y Autenticación
// Evidencia GA7-220501096-AA5-EV01
// ==========================================

// 1. Importar las librerías necesarias
const express = require('express');
const cors = require('cors');

// 2. Inicializar la aplicación Express
const app = express();
const PORT = 3000; // Puerto donde correrá el servidor

// 3. Middlewares: Permiten que el servidor entienda JSON y permita peticiones externas
app.use(express.json());
app.use(cors());

// 4. Base de datos simulada en memoria (Arreglo de usuarios)
// En un proyecto real, aquí se conectaría a MySQL o MongoDB
const usuarios = [];

// ==========================================
// RUTAS DEL SERVICIO WEB
// ==========================================

// ENDPOINT 1: Registro de usuario (POST /api/register)
app.post('/api/register', (req, res) => {
    const { usuario, password } = req.body;

    // Validación básica: que no vengan vacíos
    if (!usuario || !password) {
        return res.status(400).json({ 
            status: "error", 
            mensaje: "El usuario y la contraseña son obligatorios." 
        });
    }

    // Verificar si el usuario ya existe
    const existeUsuario = usuarios.find(u => u.usuario === usuario);
    if (existeUsuario) {
        return res.status(400).json({ 
            status: "error", 
            mensaje: "El usuario ya está registrado." 
        });
    }

    // Guardar el nuevo usuario
    usuarios.push({ usuario, password });
    
    // Devolver mensaje de éxito
    res.status(201).json({ 
        status: "success", 
        mensaje: "Usuario registrado exitosamente." 
    });
});

// ENDPOINT 2: Inicio de sesión (POST /api/login)
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;

    // Validación básica: que no vengan vacíos
    if (!usuario || !password) {
        return res.status(400).json({ 
            status: "error", 
            mensaje: "El usuario y la contraseña son obligatorios." 
        });
    }

    // Buscar si el usuario existe y la contraseña coincide
    const usuarioEncontrado = usuarios.find(
        u => u.usuario === usuario && u.password === password
    );

    // Condicional: Si la autenticación es correcta o incorrecta
    if (usuarioEncontrado) {
        // Autenticación satisfactoria
        res.status(200).json({ 
            status: "success", 
            mensaje: "Autenticación satisfactoria. ¡Bienvenido!" 
        });
    } else {
        // Error en la autenticación
        res.status(401).json({ 
            status: "error", 
            mensaje: "Error en la autenticación. Usuario o contraseña incorrectos." 
        });
    }
});

// ==========================================
// INICIALIZACIÓN DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Rutas disponibles:`);
    console.log(`POST http://localhost:${PORT}/api/register`);
    console.log(`POST http://localhost:${PORT}/api/login`);
});
