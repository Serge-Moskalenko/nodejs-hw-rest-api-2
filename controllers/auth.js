const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const avatarsPath= path.join(__dirname,'../','public','avatars')

const register = async (req, res) => {
    const { email, password} = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409,"Email is used")
    };
    const makeHashPassword = await bcrypt.hash(password, 12);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: makeHashPassword,avatarURL });
 

    res.status(201).json({
        email: newUser.email,
        name: newUser.name,
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "User not found")
    };
    const makeHashPassword = await bcrypt.compare(password, user.password);

    if (!makeHashPassword) {
        throw HttpError(401, "Wrong password");
    };

    const payload = { id: user._id };

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({ token });
};

const current = async (req, res) => {
    const { name, email } = req.user;
    res.json({ name, email })
};

const logout = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { token: '' });
    res.json({ messege: 'Logout success' });
};

const avatar = async (req, res) => {
    const { originalname, path: tempPath } = req.file;
    
    const resultUploadAvatar = path.join(avatarsPath, `${req.user._id}_${originalname}`);
    makeJimp(tempPath,resultUploadAvatar)

    const avatarURL = path.join('avatars', originalname);
    
   await User.findByIdAndUpdate(req.user._id, { avatarURL });

    res.status(201).json({ avatarURL });
};

const makeJimp = (pathImage,resultUploadAvatar) => {
    Jimp.read(pathImage)
        .then((lenna) => {
            lenna.resize(250, 250).quality(60).write(resultUploadAvatar)
        })
  .catch((err) => {
    console.error(err);
  });
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    avatar:ctrlWrapper(avatar)
}