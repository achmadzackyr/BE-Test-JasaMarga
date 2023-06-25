module.exports = (sequelize, DataTypes) => {
    const Ruas = sequelize.define("ruas", {
        ruas: {
            type: DataTypes.STRING,
            allowNull: false
        },
        km_awal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        km_akhir: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN
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
    return Ruas
}