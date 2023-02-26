module.exports = (sequelize, DataTypes) =>{
    const users = sequelize.define("Users", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type : DataTypes.STRING,
            allowNull : false
        },
        rollNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return users;
}