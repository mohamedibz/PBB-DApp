import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Necesario para __dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


//
// Sirve los archivos estáticos desde la carpeta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Redirige todas las rutas a index.html para manejar el enrutamiento en React
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

