const express = require("express");
const { body } = require('express-validator')

const registerValidation = [
    body('fullname', "Fullname is required").exists().trim().notEmpty(),
    body('username').exists().trim().notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username minimum length is 3 characters"),
    body('password').exists().trim().notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password minimum length is 6 characters"),
];

const loginValidation = [
    body('username').exists().trim().notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username minimum length is 3 characters"),
    body('password').exists().trim().notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password minimum length is 6 characters"),
];

const createRuasValidation = [
    body('ruas', "Ruas is required").exists().trim().notEmpty(),
    body('km_awal', "Km awal is required").exists().trim().notEmpty(),
    body('km_akhir', "Km akhir is required").exists().trim().notEmpty(),
];

const updateRuasValidation = [
    body('ruas', "Ruas is required").exists().trim().notEmpty(),
    body('km_awal', "Km awal is required").exists().trim().notEmpty(),
    body('km_akhir', "Km akhir is required").exists().trim().notEmpty(),
    body('status', "Status is required").exists().trim().notEmpty(),
];


module.exports = {
    registerValidation,
    loginValidation,
    createRuasValidation,
    updateRuasValidation
};