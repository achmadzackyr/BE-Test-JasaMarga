const bcrypt = require("bcrypt");
const db = require("../Models");
const { validationResult } = require('express-validator');

const Ruas = db.ruas;
const RuasCoordinate = db.ruasCoordinates;

const getAll = async (req, res) => {
    try {

        const ruasList = await Ruas.findAll({ include: RuasCoordinate });

        if (ruasList.length == 0) {
            return res.status(200).send({
                success: true,
                message: 'Ruas record is empty',
                data: null
            });
        } else {
            return res.status(200).send({
                success: true,
                message: 'Ruas record list',
                data: ruasList
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

const detail = async (req, res) => {
    try {

        const isExist = await Ruas.findByPk(req.params.id, { include: RuasCoordinate });

        if (isExist) {
            return res.status(200).send({
                success: true,
                message: 'Ruas was found',
                data: isExist
            });
        } else {
            return res.status(404).send({
                success: false,
                message: `Ruas with id = ${req.params.id} is not found`,
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

        const { ruas, km_awal, km_akhir, coordinates } = req.body;
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

        const coordinateList = [];
        coordinates.forEach(c => {
            coordinateList.push({
                ruas_id: ruasCreate.id,
                coordinates: c,
                created_by: req.username,
                updated_by: req.username,
                created_at: Date.now(),
                updated_at: Date.now()
            });
        });

        //Insert to ruas coordinates if successfully create ruas
        if (ruasCreate) {
            RuasCoordinate.bulkCreate(coordinateList).then(function () {
                return res.status(200).send({
                    success: true,
                    message: 'Ruas was created successfully',
                    data: {
                        ruasCreate
                    }
                });
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

const update = async (req, res) => {
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

        const isExist = await Ruas.findByPk(req.params.id);

        if (!isExist) {
            return res.status(404).send({
                success: false,
                message: `Ruas with id = ${req.params.id} is not found`,
                data: null
            });
        }

        const { ruas, km_awal, km_akhir, status, coordinates } = req.body;
        const data = {
            ruas,
            km_awal,
            km_akhir,
            status,
            updated_by: req.username,
            updated_at: Date.now()
        };

        //delete all ruas coordinates
        const ruasCoordinateDelete = await RuasCoordinate.destroy({
            where: {
                ruas_id: req.params.id
            }
        });

        const coordinateList = [];
        coordinates.forEach(c => {
            coordinateList.push({
                ruas_id: req.params.id,
                coordinates: c,
                created_by: req.username,
                updated_by: req.username,
                created_at: Date.now(),
                updated_at: Date.now()
            });
        });

        const updatedData = {
            id: isExist.dataValues.id,
            ruas,
            km_awal,
            km_akhir,
            status,
            created_by: isExist.dataValues.created_by,
            updated_by: req.username,
            created_at: isExist.dataValues.created_at,
            updated_at: new Date(data.updated_at).toISOString(),
            ruasCoordinates: coordinateList
        }

        //update ruas
        const ruasUpdate = await Ruas.update(data, {
            where: {
                id: req.params.id
            }
        });

        if (ruasUpdate == 1) {
            RuasCoordinate.bulkCreate(coordinateList).then(function () {
                return res.status(200).send({
                    success: true,
                    message: 'Ruas was udpated successfully',
                    data: updatedData
                });
            });
        } else {
            return res.status(400).send({
                success: false,
                message: 'Update ruas is failed',
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

const deleteRuas = async (req, res) => {
    try {
        const isExist = await Ruas.findByPk(req.params.id);

        if (!isExist) {
            return res.status(404).send({
                success: false,
                message: `Ruas with id = ${req.params.id} is not found`,
                data: null
            });
        }

        //delete its ruas coordinates
        const ruasCoordinateDelete = await RuasCoordinate.destroy({
            where: {
                ruas_id: req.params.id
            }
        });

        //delete ruas
        const ruasDelete = await Ruas.destroy({
            where: {
                id: req.params.id
            }
        });

        if (ruasDelete == 1) {
            return res.status(200).send({
                success: true,
                message: 'Ruas was deleted successfully',
                data: null
            });
        } else {
            return res.status(400).send({
                success: false,
                message: 'Delete ruas is failed',
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
    create,
    update,
    deleteRuas,
    detail,
    getAll
};