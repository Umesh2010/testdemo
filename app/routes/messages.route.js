const express = require('express');
const urlRoutes = express.Router();

const upload = require('../shared/upload/chatUpload.controller');

const controller = require('../controllers/messages.controller');

urlRoutes.put('/:id', upload.upload.single('messageImg'), controller.putMessagesReq);

module.exports = urlRoutes;