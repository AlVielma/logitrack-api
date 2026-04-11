import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary tomará automáticamente la variable CLOUDINARY_URL de tu .env
// Solo forzamos que siempre use URLs seguras (HTTPS)
cloudinary.config({
  secure: true
});

export default cloudinary;