import { promises as fsPromises } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import IUploadRepository, { UploadResponse } from "./interface.file.storage.service";
import logger from '../../utils/loggers/logger.util';

export default class FileSystemRepository implements IUploadRepository {
    async upload(data: Buffer): Promise<UploadResponse> {
        try {
            // Generate a unique filename using UUID
            const filename = `${uuidv4()}.bin`;

            // Define the path to the storage folder
            const storageFolderPath = path.join(__dirname, '../storage');

            // Check if the storage folder exists, create it if not
            await fsPromises.mkdir(storageFolderPath, { recursive: true });

            // Write the buffer data to a file in the storage folder
            await fsPromises.writeFile(path.join(storageFolderPath, filename), data);

            // Return the upload response
            const ext = path.extname(filename).substring(1); // Get the file extension
            const location = path.join(storageFolderPath, filename); // Construct the file location
            const key = path.basename(filename, `.${ext}`); // Get the file key (without extension)

            return {
                location,
                key,
                ext
            };
        } catch (error) {
            // Handle any errors
            console.error('Error uploading file:', error);
            throw new Error('Error uploading file');
        }
    }

    async remove(key: string, ext?: string | undefined): Promise<void> {
        try {
            // Construct the full path to the file
            const filePath = path.join(__dirname, '../storage', key);

            // Check if the file exists
            const fileExists = await fsPromises.stat(filePath);

            // If the file exists, delete it
            if (fileExists.isFile()) {
                await fsPromises.unlink(filePath);
                logger.debug(`File ${key} has been successfully deleted.`);
            } else {
                logger.error(`File ${key} does not exist.`);
            }
        } catch (error) {
            // Handle any errors
            logger.error(`Error removing file ${key}:`, error);
            throw new Error(`Error removing file ${key}`);
        }
    }
}
