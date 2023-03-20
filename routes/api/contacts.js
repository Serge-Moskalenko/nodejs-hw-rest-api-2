const express = require('express');
const { getAll, getById, getPost, getDelete, getPut ,patchFavorite} = require("../../controllers/contacts.js");
const router = express.Router();
const { validateBody, isValidId, authorizationUser } = require("../../middlewares");
const { addSchema, favoriteSchema } = require("../../models/contact");


router.get('/',authorizationUser,getAll)

router.get("/:id",authorizationUser,isValidId,  getById);

router.post('/', authorizationUser,validateBody(addSchema),getPost)

router.delete('/:id',authorizationUser, getDelete )

router.put("/:id", authorizationUser,isValidId, validateBody(addSchema), getPut)

router.patch("/:id/favorite",authorizationUser, isValidId, validateBody(favoriteSchema), patchFavorite)
module.exports = router
