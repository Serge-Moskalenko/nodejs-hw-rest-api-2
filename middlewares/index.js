const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const authorizationUser = require("./authorization");
const upload = require("./upload");

module.exports = {
    validateBody,
    isValidId,
    authorizationUser,
    upload,
}