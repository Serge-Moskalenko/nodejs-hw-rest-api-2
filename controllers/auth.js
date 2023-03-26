const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { transporter,makeJimp } = require("../tools")
const { nanoid } = require("nanoid");
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
    const verificationCode = nanoid();

    const newUser = await User.create({
        ...req.body
        , password: makeHashPassword
        , avatarURL
        , verificationCode
    });

    transporter(email, verificationCode);
 
    res.status(201).json({
        email: newUser.email,
        name: newUser.name,
    })
};

const verifyEmail = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
        throw HttpError(401, 'not found')
    };
    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: '' });
    
    res.json({ messege: 'verify success' })
};

const repeatedVerify = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'not found')
    };
    if (user.verify) {
        throw HttpError(401, 'user verify')
    };

    transporter(email, user.verificationCode);
    
    res.json({messege:"verify email send success"})
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "User not found")
    };
    const makeHashPassword = await bcrypt.compare(password, user.password);

    if (!user.verify) {
        throw HttpError(401, "User not verified")
    }

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
    
module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    avatar: ctrlWrapper(avatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    repeatedVerify: ctrlWrapper(repeatedVerify),
};