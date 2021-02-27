const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'Products',
        prods: products,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        path: '/products',
        pageTitle: 'Product | ' + product.title,
        product: product
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Products',
        prods: products,
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      })
    })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart')
      // console.log(result);
    })
  // req.user.addToCart({})
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
    .then(result => {
      return res.redirect('/cart')
    })
    .catch(err => {
      console.log(err);
    })
}

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/cart', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   })
// }

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Orders',
      orders: orders
    })
  })
}

exports.postOrder = (req, res, next) => {
  req.user.addOrder()
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log(err);
    })
}