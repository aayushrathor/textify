const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const path = require("path");

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./src/index.html"));
});

app.post('/textify', upload.single("image"), (req, res) => {
    console.log(req.file);
    res.send("Image uploaded successfully.");
})

async function getImage() {
    try {
        const imgMetaData = await sharp("./image.png").metadata();
        console.log(imgMetaData);
    } catch (error) {
        console.error(error);
    }
}

async function resizeImage() {
    try {
        await sharp("image.png")
            .resize({
                width: 960,
                height: 540
            })
            .toFormat("jpeg", { mozjpeg: true })
            .toFile("image-resized.jpeg");
    } catch (error) {
        console.log(error);
    }
}

async function cropImage() {
    try {
        await sharp("image.png")
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
        const text = "Huehuehuehuehuehuehuehuehue";

        const svgImage = `
        <svg width="${width}" height="${height}">
          <style>
          .title { fill: #FFF; font-size: 70px; font-weight: bold;}
          </style>
          <text x="50%" y="50%" text-anchor="middle" class="title">${text}</text>
        </svg>
        `;
        const svgBuffer = Buffer.from(svgImage);
        const image = await sharp("image.png")
            .composite([
                {
                    input: svgBuffer,
                    top: 0,
                    left: 0,
                },
            ])
            .toFile("finalImage.png");
    } catch (error) {
        console.log(error);
    }d
}
// getImage();
// addTextOnImage();

const PORT = 8000;
console.log(`Server running on https://localhost:${PORT}`);
app.listen(PORT);