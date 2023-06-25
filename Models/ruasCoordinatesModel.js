module.exports = (sequelize, DataTypes) => {
    const RuasCoordinates = sequelize.define("ruasCoordinates", {
        coordinates: {
            type: DataTypes.STRING,
            allowNull: false
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
    },)
    return RuasCoordinates
}