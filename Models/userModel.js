module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define( "user", {
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_login: {
            type: DataTypes.DATE
        },
        created_by: {
            type: DataTypes.STRING
        },
        updated_by: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }, )
    return User
 }