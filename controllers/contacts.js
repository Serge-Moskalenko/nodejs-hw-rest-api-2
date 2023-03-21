const { HttpError, ctrlWrapper } = require("../helpers");
const { Contact } = require("../models/contact");

const getAll = async (req, res,) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const results = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "name email");
    res.json(results)
};

const getById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findById(id)
    if (!result) {
        throw HttpError(404, "Not found contact");
    };
    res.json(result);
};

const getPost = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
   
};

const getDelete = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndRemove(id);
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json({
        message: "Delete success"
    })
};

const getPut = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true});
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result);
};

const patchFavorite = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true});
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result);
};


module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    getPost: ctrlWrapper(getPost),
    getDelete: ctrlWrapper(getDelete),
    getPut: ctrlWrapper(getPut),
    patchFavorite:ctrlWrapper(patchFavorite),
};