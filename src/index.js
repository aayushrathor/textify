const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: fileStorageEngine });

app.use(express.static(__dirname + '/'));

async function usertext() {
    const userinput = document.getElementById("imgtext").value;
    console.log(userinput);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/textify', upload.single("image"), (req, res) => {
    const newname = path.join('inputImage.png');
    fs.rename(path.join(__dirname + `../../` + 'images/' + req.file.originalname), path.join(__dirname + `../../` + 'images/' + newname), (err) => {
        if (err) {
            console.error(err);
        }
    });
    res.send("Image uploaded successfully.");
});

async function getImage() {
    try {
        const imgMetaData = await sharp("inputImage.png").metadata();
    } catch (error) {
        console.error(error);
    }
}

async function resizeImage() {
    try {
        await sharp("inputImage.png")
            .resize({
                width: 960,
                height: 540
            })
            .toFormat("jpeg", { mozjpeg: true })
            .toFile("resizedImage.png");
    } catch (error) {
        console.log(error);
    }
}

async function cropImage() {
    try {
        await sharp("inputImage.png")
            .extract({ width: 960, height: 540, left: 0, top: 0 })
            .toFile("image-crop.png")
    } catch (error) {
        console.error(error);
    }
}

async function addTextOnImage() {
    try {
        const width = 750;
        const height = 483;

        const svgImage = `
        <svg width="${width}" height="${height}">
          <style>
          .title { fill: #FFF; font-size: 70px; font-weight: bold;}
          </style>
          <text x="50%" y="50%" text-anchor="middle" class="title">${userinput}</text>
        </svg>
        `;
        const svgBuffer = Buffer.from(svgImage);
        alert(svgBuffer);
        const imagePath = "/images/inputImage.png";
        const image = await sharp(imagePath)
            .composite([
                {
                    input: svgBuffer,
                    top: 0,
                    left: 0,
                },
            ])
            .toFile('/images/outputImage.png');
    } catch (error) {
        console.log(error);
    }
}

// getImage();
// addTextOnImage();

const PORT = 8000;
app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server running on https://localhost:${PORT}`);
    }
});