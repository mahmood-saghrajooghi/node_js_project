const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const errorController = require('./controllers/error')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded())
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart)
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

let _user;
sequelize
  // .sync({ force: true })
  .sync()
  .then(res => {
    return User.findByPk(1)
  })
  .then(user => {
    _user = user;
    if(!_user) {
      _user =  User.create({name: 'mem', email: 'mem@memestan.mem'})
      return _user;
    }
    return _user;
  })
  .then(user => {
    return user.getCart();
  })
  .then((cart) => {
    if(!cart) {
      return _user.createCart();
    }
    return cart;
  })
  .then(cart => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err);
  })
