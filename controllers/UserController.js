require('dotenv').config({ path: "../config.env" })
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");

function token(rollNo) {
    return jwt.sign({ rollNo }, `${process.env.JWT_SECRET}`, { expiresIn: "1d" })
}

const addUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            rollNo: req.body.rollNo
        }
    })
    if(user){
        res.status(400).json("User already exists");
    }
    else{
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
            const jsonToken = token(req.body.rollNo);
            const user = await Users.create({
                name: req.body.name,
                rollNo: req.body.rollNo,
                password: hash,
                role: req.body.role
            });
            res.status(200).json({ "message": "User created successfully!", "body": user, "token": jsonToken });
        } catch (err) {
            throw err;
        }
    }
}

const loginUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            rollNo: req.body.rollNo
        }
    });
    if (!user) {
        res.status(201).json("no such user exists");
    }
    else{
        const match = await bcrypt.compare(req.body.password, user.password)
        if (match) {
            const jsonToken = token(req.body.rollNo);
            res.status(200).json({ "id": user.id, "name": user.name, "role": user.role,"rollNo": user.rollNo,"token": jsonToken })
        }
        else {
            res.status(201).json("wrong password");
        }
    }
}


const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.destroy({
            where: {
                id: id
            }
        })
        res.status(200).json({ "message": "User deleted successfully!", "body": user });
    } catch (err) {
        throw err;
    }
}

const getUsers = async (req, res) =>{
    const user = Users.findAll({
        where: {
            role : req.body.user.role,
        }
    }).then((docs, err)=>{
        if(err){
            res.status(401).json({error: err});
        }
        else{
            const user = req.body.user;
            let data = [];
            docs.map((val, index)=>{
                if(val.rollNo[0]===user.rollNo[0] && val.rollNo[1]===user.rollNo[1]){
                    data.push(val);
                }
            })
            res.status(200).json(data)
        }
    })
}

module.exports = { addUser, deleteUser, loginUser, getUsers };