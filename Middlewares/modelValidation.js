const express = require("express");
const { body } = require('express-validator')

const registerValidation = [
    body('fullname', "Fullname is required").exists().trim().notEmpty(),
    body('username', "Username is required").exists().trim().notEmpty(),
    body('password', "Password is required").exists().trim().notEmpty(),
];

const loginValidation = [
    body('username', "Username is required").exists().trim().notEmpty(),
    body('password', "Password is required").exists().trim().notEmpty(),
];

const createRuasValidation = [
    body('ruas', "Ruas is required").exists().trim().notEmpty(),
    body('km_awal', "Km awal is required").exists().trim().notEmpty(),
    body('km_akhir', "Km akhir is required").exists().trim().notEmpty(),
];


module.exports = {
    registerValidation,
    loginValidation,
    createRuasValidation
};