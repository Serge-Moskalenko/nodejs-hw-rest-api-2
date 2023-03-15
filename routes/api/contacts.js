const express = require('express');
const { getAll, getById, getPost, getDelete, getPut ,patchFavorite} = require("../../controllers/contacts.js");
const router = express.Router();
const { validateBody,isValidId } = require("../../middlewares");
const {addSchema,favoriteSchema}=require("../../models/contact")


router.get('/',getAll)

router.get("/:id",isValidId,  getById);

router.post('/', validateBody(addSchema),getPost)

router.delete('/:id', getDelete )

router.put("/:id", isValidId, validateBody(addSchema), getPut)

router.patch("/:id/favorite", isValidId, validateBody(favoriteSchema), patchFavorite)
module.exports = router
