//importing modules
const {Sequelize, DataTypes} = require('sequelize')

//Database connection with dialect of postgres specifying the database we are using
//const sequelize = new Sequelize(`postgres://postgres:123456@localhost:5433/betest`, {dialect: "postgres"})
const sequelize = new Sequelize(
    process.env.db_database,
    process.env.db_username,
    process.env.db_password,
    {
        host: process.env.db_host,
        dialect: process.env.db_dialect,

        pool: {
            max: parseInt(process.env.db_max_pool, 10),
            min: parseInt(process.env.db_min_pool, 10),
            acquire: parseInt(process.env.db_acquire_pool, 10),
            idle: parseInt(process.env.db_idle_pool, 10)
        }
    }
);

//checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Database connected to betest`)
}).catch((err) => {
    console.log(err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.users = require('./userModel') (sequelize, DataTypes)

//exporting the module
module.exports = db