// fileControllers.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Calcula la ruta del directorio de subida en módulos ES6
const __filename = new URL(import.meta.url).pathname;
// Corrige el problema de la ruta en Windows
const __dirname = path.dirname(decodeURI(process.platform === 'win32' ? __filename.substring(1) : __filename));
const uploadDir = path.join(__dirname, '../files/uploads');

// Función para verificar y crear el directorio si no existe
function ensureUploadDirExists() {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
}

// Resto del código...


// Función para verificar y crear el directorio si no existe


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        ensureUploadDirExists();
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: storage });

export const getFiles = (req, res) => {
    ensureUploadDirExists();
    fs.readdir(uploadDir, (err, files) => {
        if (err) throw err;
        res.send(files);
    });
};


export const getFile = (req, res) => {
    ensureUploadDirExists();
    res.sendFile(path.resolve(uploadDir, req.params.name));
};

export const deleteFile = (req, res) => {
    ensureUploadDirExists();
    fs.unlink(path.resolve(uploadDir, req.params.name), err => {
        if (err) throw err;
        res.send('Archivo eliminado con éxito');
    });
};
