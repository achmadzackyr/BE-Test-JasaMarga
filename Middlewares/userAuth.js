const express = require("express");
const db = require("../Models");
const jwt = require("jsonwebtoken");

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

const verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            success: false,
            message: "No token provided",
            data: null
        });
    }

    jwt.verify(token, process.env.secret_key, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized",
                data: null
            });
        }
        req.username = decoded.id;

        //validate username in database
        User.findOne({
            where: {
                username: req.username
            }
        }).then((user) => {
            if (user) {
                next();
            } else {
                return res.status(401).send({
                    success: false,
                    message: "Unauthorized",
                    data: null
                });
            }
        })
    });
};

//exporting module
module.exports = {
    saveUser,
    verifyToken
};