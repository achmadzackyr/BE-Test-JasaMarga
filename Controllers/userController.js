const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const multer = require('multer')
const readXlsxFile = require('read-excel-file/node')

// Assigning users to the variable User
const User = db.users;

//hashing users password before its saved to the database with bcrypt
const register = async (req, res) => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: 'Invalid request',
                data: errors.array()
            });
        }

        const { fullname, username, password } = req.body;
        const data = {
            fullname,
            username,
            password: await bcrypt.hash(password, 10),
            created_by: 'SYSTEM',
            updated_by: 'SYSTEM',
            created_at: Date.now(),
            updated_at: Date.now()
        };
        //saving the user
        const user = await User.create(data);

        //if user details is captured
        if (user) {
            return res.status(200).send({
                success: true,
                message: 'User was registered successfully',
                data: {
                    user
                }
            });
        } else {
            return res.status(400).send({
                success: false,
                message: 'Register user is failed',
                data: null
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message,
            data: null
        });
    }
};


//login authentication
const login = async (req, res) => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: 'Invalid request',
                data: errors.array()
            });
        }

        const { username, password } = req.body;

        //find a user by their username
        const user = await User.findOne({
            where: {
                username: username
            }
        });

        //if user username is found, compare password with bcrypt
        if (user) {
            const isSame = await bcrypt.compare(password, user.password);

            //if password is the same
            //generate token with the user's id and the secret_key in the env file
            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.secret_key, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                //update last login data
                user.last_login = Date.now();
                await user.save();

                return res.status(200).send({
                    success: true,
                    message: 'User logged in successfully',
                    data: {
                        user,
                        accessToken: token
                    }
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid username or password',
                    data: null
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                message: 'Username is not registered',
                data: null
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message,
            data: null
        });
    }
};

const importUser = async (req, res, next) => {
    try {
        //get file path
        let path = req.file.path;
        let userList = [];

        readXlsxFile(path).then((rows) => {
            //remove table header
            rows.shift()
            rows.forEach(r => {
                userList.push({
                    fullname: r[1],
                    username: r[2],
                    password: bcrypt.hashSync(r[3].toString(), 10),
                    created_by: 'SYSTEM',
                    updated_by: 'SYSTEM',
                    created_at: Date.now(),
                    updated_at: Date.now()
                });
            });

            //return list of user
            return userList;
        }).then((users) => {
            //bulk saving the user
            User.bulkCreate(users, { returning: true, ignoreDuplicates: true }).then(function (user) {
                return res.status(200).send({
                    success: true,
                    message: 'User was imported successfully',
                    data: {
                        user
                    }
                });
            }).catch(function (err) {
                console.log(err);
                return res.status(500).send({
                    success: false,
                    message: err,
                    data: null
                });
            });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message,
            data: null
        });
    }
};

module.exports = {
    register,
    login,
    importUser
};