const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const register = async (req, res) => {
    const { email, password} = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409,"Email is used")
    };
    const makeHashPassword=await bcrypt.hash(password,12)
    
    const newUser = await User.create({ ...req.body, password: makeHashPassword });
 

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

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout:ctrlWrapper(logout)
}