const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  
  Product.findByPk(prodId)
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
  Product.findAll()
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
    .then(cart => {
      return cart.getProducts()
    })
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      })
    })
    .catch(err => {
      console.log(err);
    })
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = []
  //     for (let product of products) {
  //       const cartProductData = cart.products.find(p => p.id === product.id);
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     })
  //   })
  // })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0]
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId)

    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      })
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0]
      if (product) {
        return product.cartItem.destroy();
      }
      return Promise.resolve();
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/cart', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then(orders => {
    console.log(orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Orders',
      orders: orders
    })
  })
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder().then(order => {
        order.addProducts(products.map(product => {
          product.orderItem = { quantity: product.cartItem.quantity }
          return product;
        }))
      })
        .catch(err => {
          console.log(err);
        })
    })
    .then(result => {
      return fetchedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => {
      console.log(err);
    })
}