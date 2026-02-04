import multer from "multer";

const imgDirectory = './public/images/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imgDirectory);
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

export { upload, imgDirectory };