require('dotenv').config({ path: "../config.env" })
const { google } = require('googleapis');
const CourseContent = require("../models/content");

const setDriveAuth = () => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
    )

    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const drive = google.drive({
        version: "v3",
        auth: oauth2Client
    });

    return drive;
}

const uploadFile = async (drive, req, res) => {
    console.log(req.files)
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.files[0].buffer);
    try {
        const response = await drive.files.create({
            requestBody: {
                name: req.files[0].originalname,
                mimeType: req.files[0].mimetype
            },
            media: {
                mimeType: req.files[0].mimetype,
                body: bufferStream
            }
        });
        return response.data;
    } catch (error) {
        console.log(error)
        res.status(401)
    }
}

const generateUrl = async (req, res) => {
    try {
        const drive = setDriveAuth();
        const data = await uploadFile(drive, req, res);
        drive.permissions.create({
            fileId: data.id,
            requestBody: {
                role: "reader",
                type: "anyone"
            }
        })

        const result = await drive.files.get({
            fileId: data.id,
            fields: 'webViewLink, webContentLink'
        })
        console.log(result.data.webViewLink);
        return {
            webViewLink: result.data.webViewLink,
            webContentLink: result.data.webContentLink,
            fileID: data.id
        };
    } catch (error) {
        console.log(error);
        res.status(401).json({ Error: error });
    }
}

const addContent = async (req, res) => {
    const { type, semester, courseCode, name, rollNo, desc, anonymous } = req.body;
    let publicUrl, downloadUrl, fileID;
    if (type === "Playlist") {
        publicUrl = req.body.url
        downloadUrl = req.body.url
        fileID = publicUrl
    }
    else {
        let object = await generateUrl(req, res);
        publicUrl = object.webViewLink;
        downloadUrl = object.webContentLink;
        fileID = object.fileID;
    }

    try {
        const data = await CourseContent.create({
            semester: semester,
            type: type,
            courseCode: courseCode,
            authorName: name,
            authorID: rollNo,
            description: desc,
            anonymous: anonymous,
            publicUrl: publicUrl,
            downloadUrl: downloadUrl,
            fileID: fileID
        })
        res.status(200).json(data);
    } catch (error) {
        console.log(error)
        res.status(401).json({ Error: error });
    }
}

const deleteContent = async (req, res) => {
    const { isPlaylist, fileID } = req.params;
    if (isPlaylist === "false") {
        const drive = setDriveAuth();
        try {
            await CourseContent.findOneAndDelete({
                fileID: fileID
            }).then(async () => {
                drive.files.delete({
                    fileId: fileID
                }).then(() => {
                    res.status(200).json("File deleted successfully!!");
                })
            })
        } catch (error) {
            console.log(error);
            res.status(401).json({ Error: error })
        }
    }
    else {
        try {
            await CourseContent.findOneAndDelete({
                _id : fileID
            }).then((response) => {
                res.status(200).json("File deleted successfully!!");
            })
        } catch (error) {
            console.log(error);
        }
    }
}

const getContent = async (req, res) => {
    const role = req.body.user[0].role;
    if (role === "Owner") {
        try {
            const data = await CourseContent.find({});
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(401).json({ Error: error });
        }
    }
    else if (role === "Admin1") {
        try {
            const data = await CourseContent.find({
                semester: "FIRST" || "SECOND"
            });
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(401).json({ Error: error });
        }
    }
    else if (role === "Admin2") {
        try {
            const data = await CourseContent.find({
                semester: "THIRD" || "FOURTH"
            });
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(401).json({ Error: error });
        }
    }
    else if (role === "Admin3") {
        try {
            const data = await CourseContent.find({
                semester: "FIFTH" || "SIXTH"
            });
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(401).json({ Error: error });
        }
    }
    else if (role === "Admin4") {
        try {
            const data = await CourseContent.find({
                semester: "SEVENTH" || "EIGHTH"
            });
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(401).json({ Error: error });
        }
    }
    else if (role === "Admin5") {
        try {
            const data = await CourseContent.find({
                semester: "NINTH" || "TENTH"
            });
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(401).json({ Error: error });
        }
    }
}

const getCourseContent = async (req, res) => {
    const { code } = req.params;
    try {
        const data = await CourseContent.find({
            courseCode: code
        })
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

const editContent = async (req, res) => {
    try {
        const data = await CourseContent.findOneAndUpdate({
            fileID: req.body.fileID
        }, { ...req.body })
        res.status(200).json("Updated!!");
    } catch (error) {
        console.log(error)
    }
}

const countData = async (req, res) => {
    try {
        const content = await CourseContent.count({});
        const contributors = await CourseContent.distinct("authorID");
        // console.log(contributors.length, content);
        res.status(200).json({ content: content, contributors: contributors.length });
    } catch (error) {
        console.log(error);
    }
}

const getContributors = async (req, res) => {
    const aggregatorOpts1 = [
        {
            $match: {
                "anonymous": false
            }
        },
        {
            $group: {
                _id: { "authorID": "$authorID", "authorName": "$authorName" },
                count: { $sum: 1 }
            }
        }
    ];
    const aggregatorOpts2 = [
        {
            $match: {
                "anonymous": true
            }
        },
        {
            $group: {
                _id: { "authorID": "$authorID", "authorName": "$authorName" },
                count: { $sum: 1 }
            }
        }
    ];
    const data1 = await CourseContent.aggregate(aggregatorOpts1);
    const data2 = await CourseContent.aggregate(aggregatorOpts2);
    const data = [];
    let count=0;
    data1.map((value, index) => {
        data.push({
            name: value._id.authorName,
            rollNo: value._id.authorID,
            contributions: value.count
        })
    })
    data2.map((value, index) => {
        count = count + value.count;   
    })
    data.push({
        name: "Anonymous",
        rollNo: "--",
        contributions: count
    })
    console.log(data1, data2);
    data.sort((a,b)=>{
        return b.contributions - a.contributions;
    })
    res.status(200).json(data);
}

module.exports = { addContent, deleteContent, getContent, getCourseContent, editContent, countData, getContributors }