const bcrypt = require("bcrypt");
const db = require("../Models");
const { validationResult } = require('express-validator');

// Assigning users to the variable User
const Ruas = db.ruas;
const RuasCoordinate = db.ruasCoordinates;

const create = async (req, res) => {
    try {
        //Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: 'Invalid request',
                data: errors.array()
            });
        }

        const { ruas, km_awal, km_akhir } = req.body;
        const data = {
            ruas,
            km_awal,
            km_akhir,
            status: true,
            created_by: req.username,
            updated_by: req.username,
            created_at: Date.now(),
            updated_at: Date.now()
        };
        //saving the ruas
        const ruasCreate = await Ruas.create(data);

        //if ruas details is captured
        if (ruasCreate) {
            return res.status(200).send({
                success: true,
                message: 'Ruas was created successfully',
                data: {
                    ruasCreate
                }
            });
        } else {
            return res.status(400).send({
                success: false,
                message: 'Create ruas is failed',
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

module.exports = {
    create
};