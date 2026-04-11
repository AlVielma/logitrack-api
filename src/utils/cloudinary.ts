import cloudinary from "../configs/cloudinary";

/**
 * Función que sube un archivo temporal (Buffer) en memoria a Cloudinary
 * y retorna la URL pública de la imagen.
 * 
 * @param fileBuffer - El archivo en crudo desde el req.file.buffer
 * @param folderName - La subcarpeta donde se guardará (ej: 'users', 'clients', 'vehicles')
 */
export const uploadToCloudinary = (fileBuffer: Buffer, folderName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Inicializamos el flujo de subida (stream)
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: `logitrack/${folderName}`,
                resource_type: "auto" // Detecta si es imagen, video o raw
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error || new Error("Failed to upload to Cloudinary"));
                }
                // Si sale bien, retornamos la URL segura (https)
                resolve(result.secure_url);
            }
        );

        // Disparamos el stream enviando los bytes del archivo
        uploadStream.end(fileBuffer);
    });
};