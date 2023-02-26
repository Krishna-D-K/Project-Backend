module.exports = (sequelize, DataTypes) =>{
    const courseContent = sequelize.define("CourseContent", {
        courseCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publicUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        authorName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        authorID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        anonymous: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        fileID: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return courseContent;
}