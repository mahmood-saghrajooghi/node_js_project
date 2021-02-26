const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== 'true') {
    return res.redirect('/')
  }
  const prodId = req.params.productId;
  req.user.getProducts({where: {id: prodId}})
    .then(products => {
      if (!products) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: editMode,
        product: products[0]
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
  })
    .then(result => {
      console.log(result);
      res.redirect('/')
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  Product.findByPk(id)
    .then(product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then((products) => {
      res.render('admin/products', {
        pageTitle: 'Products',
        prods: products,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.findByPk(id)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err);
    });
}