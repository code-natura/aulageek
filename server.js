const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = './libros.json';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Sirve archivos estáticos como el index.html

// Obtener todos los libros
app.get('/api/libros', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer los datos' });
        }
        res.json(JSON.parse(data));
    });
});

// Agregar un libro
app.post('/api/libros', (req, res) => {
    const nuevoLibro = req.body;
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer los datos' });
        }
        const libros = JSON.parse(data);
        libros.push(nuevoLibro);
        fs.writeFile(DATA_FILE, JSON.stringify(libros, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar el libro' });
            }
            res.status(201).json(nuevoLibro);
        });
    });
});

// Eliminar un libro
app.delete('/api/libros/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer los datos' });
        }
        const libros = JSON.parse(data);
        if (index < 0 || index >= libros.length) {
            return res.status(400).json({ error: 'Índice inválido' });
        }
        libros.splice(index, 1);
        fs.writeFile(DATA_FILE, JSON.stringify(libros, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el libro' });
            }
            res.status(204).end();
        });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
