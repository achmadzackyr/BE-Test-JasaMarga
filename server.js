const express = require('express')
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const bodyParser = require("body-parser");
const db = require('./Models')
const userRoutes = require('./Routes/userRoutes')
const ruasRoutes = require('./Routes/ruasRoutes')

//setting up your port
const PORT = process.env.port || 3000
//assigning the variable app to express
const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ force: true }).then(() => {
    console.log("db has been re sync")
})

//routes for the user API
app.use('/api/users', userRoutes)

//routes for the ruas API
app.use('/api/ruas', ruasRoutes)

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))