import multer from 'multer';

// Configuración de almacenamiento en memoria (puedes cambiarlo a disco local si prefieres)
const storage = multer.memoryStorage();
export const upload = multer({ storage });
