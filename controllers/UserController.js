require('dotenv').config({ path: "../config.env" })
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");

function token(rollNo) {
    return jwt.sign({ rollNo }, `${process.env.JWT_SECRET}`, { expiresIn: `${process.env.JWT_EXPIRY}` })
}

const addUser = async (req, res) => {
    const user = await Users.find({
        rollNo: req.body.rollNo
    })
    if (user.length !== 0) {
        res.status(400).json("User already exists");
    }
    else {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
            const jsonToken = token(req.body.rollNo);
            const user = await Users.create({
                name: req.body.name,
                rollNo: req.body.rollNo,
                password: hash,
                role: req.body.role,
                email: req.body.email,
                instiMail: req.body.instiMail,
                phone: req.body.phone,
                fbLink: req.body.fbLink,
                linkedinLink: req.body.linkedinLink
            });
            res.status(200).json({ "message": "User created successfully!", "body": user, "token": jsonToken });
        } catch (err) {
            throw err;
        }
    }
}

const loginUser = async (req, res) => {
    const user = await Users.find({
        rollNo: req.body.rollNo
    });
    if (user.length === 0) {
        res.status(201).json("no such user exists");
    }
    else {
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (match) {
            const jsonToken = token(req.body.rollNo);
            res.status(200).json({ "id": user[0].id, "name": user[0].name, "role": user[0].role, "rollNo": user[0].rollNo,"phone": user[0].phone, "email": user[0].email, "instiMail": user[0].instiMail, "fbLink": user[0].fbLink, "linkedinLink": user[0].linkedinLink, "token": jsonToken })
        }
        else {
            res.status(201).json("wrong password");
        }
    }
}


const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.findOneAndDelete({
            _id: id
        })
        res.status(200).json({ "message": "User deleted successfully!", "body": user });
    } catch (err) {
        throw err;
    }
}

const getUsers = async (req, res) => {
    if (req.body.user[0].role !== "Owner") {
        const user = await Users.find({
            role: req.body.user[0].role,
        }).then((docs, err) => {
            if (err) {
                res.status(401).json({ error: err });
            }
            else {
                const user = req.body.user[0];
                let data = [];
                docs.map((val, index) => {
                    if (val.rollNo[0] === user.rollNo[0] && val.rollNo[1] === user.rollNo[1]) { //comparing the first two digits of the roll nos
                        data.push(val);
                    }
                })
                res.status(200).json(data)
            }
        })
    }
    else {
        const user = await Users.find({});
        res.status(200).json(user);
    }
}

const editUser = async(req, res) =>{
    try {
        await Users.findOneAndUpdate({_id: req.body.user[0]._id}, {...req.body}).then((response)=>{
            res.status(200).json("updated Succesfully!!");
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = { addUser, deleteUser, loginUser, getUsers, editUser };