const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/products.controller');
const multer = require('multer')
const storageMulter = require('../../helpers/storageMulter');
const validatorCreateProduct = require('../../validates/admin/product.validate');

const upload = multer({ storage: storageMulter() })

router.get('/', controller.products);

router.patch('/change-status/:status/:ID', controller.changeStatus);

router.patch('/changes-multi-status', controller.changeMultiStatus);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.createItem);

router.post(
    '/create',
    upload.single('thumbnail'),
    validatorCreateProduct.createPost,
    controller.createPost
);

// router.get('/configdb', controller.configDB);

// [get] admin/products/edit/:id
router.get('/edit/:id', controller.editPost);

// [patch] admin/products/edit/:id
router.patch(
    '/edit/:id',  
    upload.single('thumbnail'),
    validatorCreateProduct.createPost,
    controller.editPostPatch
);

// [get] admin/products/detail/:id
router.get('/detail/:id', controller.detail);
module.exports = router;