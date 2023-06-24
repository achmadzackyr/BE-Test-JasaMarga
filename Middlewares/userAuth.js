const express = require("express");
const db = require("../Models");
const { body } = require('express-validator')
//Assigning db.users to User variable
const User = db.users;

//Function to check if username already exist in the database
//this is to avoid having two users with the same username
const saveUser = async (req, res, next) => {
    //search the database to see if user exist
    try {
        const username = await User.findOne({
            where: {
                username: req.body.username,
            },
        });
        //if username exist in the database respond with a status of 400
        if (username) {
            return res.status(400).send({
                success: false,
                message: 'Username already taken',
                data: null
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message,
            data: null
        });
    }
};

const registerValidation = [
    body('fullname', "Fullname is required").exists().trim().notEmpty(),
    body('username', "Username is required").exists().trim().notEmpty(),
    body('password', "Password is required").exists().trim().notEmpty(),
];

const loginValidation = [
    body('username', "Username is required").exists().trim().notEmpty(),
    body('password', "Password is required").exists().trim().notEmpty(),
];

//exporting module
module.exports = {
    saveUser,
    registerValidation,
    loginValidation
};