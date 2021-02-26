const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin')

const router = express.Router();

// GET /admin/add-product
router.get('/add-product', adminController.getAddProduct)

// GET /admin/edit-product
router.get('/edit-product/:productId', adminController.getEditProduct)

// GET /admin/products
router.get('/products', adminController.getProducts)

// POST /admin/add-product
router.post('/add-product', adminController.postAddProduct)

// POST /admin/edit-product
router.post('/edit-product', adminController.postEditProduct)

// POST /admin/delete-product
router.post('/delete-product', adminController.postDeleteProduct)


module.exports = router
