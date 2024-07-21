import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import scanService from '../services/scanner';
import openAPISolution from '../openapi/extractErrorsFromEslintResponse';

let uniqueSuffix = '';
let actualFileName = '';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        uniqueSuffix = Date.now() + '-' + file.originalname
        actualFileName = file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

function checkFileType(file: any, cb: any) {
    const filetypes = /js|application\/javascript|text\/javascript|txt|text\/plain|pdf|application\/pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb({ message: 'Files with .js or .txt or .pdf extension only allowed!' });
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myFile');

const scanFile = async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).send(err);
        } else {
            if (req.file == undefined) {
                res.status(400).send('Error: No File Selected!');
            } else {
                var filename = path.join('uploads', 'myFile-' + uniqueSuffix);
                await scanService.checkVulnerabilities(filename, actualFileName)
                    .then(result => {
                        fs.unlinkSync(filename);
                        res.status(200).send(result);
                    })
                    .catch(err => {
                        res.status(400).send(err);
                    });
            }
        }
    });
}

export default { scanFile }