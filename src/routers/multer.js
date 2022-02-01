const express = require('express');
const multer = require('multer');

const multerRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

multerRouter.post('/uploadfile', upload.single('myFile'),
    (req, res, next) => {
        const file = req.file;
        if (!file) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
        }

        res.send('Imagen subida');
    });

module.exports = multerRouter;