import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesRoot = path.resolve(__dirname, "../public/images");

const extractFileName = (imageUrl) => {
    if (!imageUrl) return null;
    try {
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            const urlObj = new URL(imageUrl);
            return path.basename(urlObj.pathname);
        }
        return path.basename(imageUrl);
    } catch {
        return null;
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagesRoot);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop();
        
        cb(null, uniqueSuffix + '.' + fileExtension);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('يجب أن تكون الملفات من نوع صورة فقط!'), false);
        }
    }
});

export { upload, imagesRoot, extractFileName };