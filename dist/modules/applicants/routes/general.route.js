"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalRouter = (0, express_1.Router)();
generalRouter.post('/signup', (req, res) => { });
generalRouter.get('/', (req, res) => {
    res.send(`<h1>Applicant Routes</h1>`);
});
exports.default = generalRouter;
