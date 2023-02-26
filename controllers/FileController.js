require('dotenv').config({ path: "../config.env" })
const { google } = require('googleapis');
const { CourseContent } = require("../models");

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
            webViewLink : result.data.webViewLink,
            fileID: data.id
        };
    } catch (error) {
        console.log(error);
        res.status(401).json({ Error: error });
    }
}

const addContent = async (req, res) => {
    const { type, courseCode, name, rollNo, desc, anonymous } = req.body;
    let publicUrl, fileID;
    if(type === "Playlist"){
        publicUrl = req.body.url
        fileID = publicUrl
    }
    else{
        let object = await generateUrl(req, res);
        publicUrl = object.webViewLink;
        fileID = object.fileID;
    }

    try {
        const data = await CourseContent.create({
            type: type,
            courseCode: courseCode,
            authorName: name,
            authorID: rollNo,
            description: desc,
            anonymous: anonymous,
            publicUrl: publicUrl,
            fileID: fileID
        })
        res.status(200).json(data);
    } catch (error) {
        console.log(error)
        res.status(401).json({ Error: error });
    }
}

module.exports = { addContent }