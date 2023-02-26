module.exports = (sequelize ,DataTypes) =>{
    const courses = sequelize.define("Courses", {
        semester: {
            type: DataTypes.STRING,
            allowNull: false
        },
        courseName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        courseCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        credits: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        professor1: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        professor2: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
    return courses;
}