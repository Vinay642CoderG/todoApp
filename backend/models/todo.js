const { Model, DataTypes } = require('sequelize')
const sequelize = require("../database")

class Todo extends Model {}
Todo.init({
    task: {
        type:DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    sequelize,
    modelName: "Todo",
    tableName: "todos",
})


module.exports = Todo;