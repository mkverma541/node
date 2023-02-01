const express = require('express');
const Route = express.Router();
const upload = require('../config/fileUpload');

const FilesController = require('../controllers/files.controller');

Route.post('/upload/files',
    upload.files(FilesController.expectedFiles()),
    FilesController.uploadFiles
)

module.exports = Route;