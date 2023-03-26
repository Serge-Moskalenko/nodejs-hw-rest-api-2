const Jimp = require("jimp");

const makeJimp = (pathImage, resultUploadAvatar) => {
    Jimp.read(pathImage)
        .then((lenna) => {
            lenna.resize(250, 250).quality(60).write(resultUploadAvatar)
        })
        .catch((err) => {
            console.error(err);
        });
};

module.exports = makeJimp;