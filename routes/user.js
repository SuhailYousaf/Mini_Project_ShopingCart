var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user);
  productHelpers.getAllproducts().then((products) => {
    res.render('user/view-products', { products, user })
  })
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {   // block back option 
    res.redirect('/');
  } else {
    res.render('user/login', { "logginErr": req.session.logginErr });
    req.session.logginErr = false;
  }
});

router.get('/signup', (req, res) => {
  res.render('user/signup',{errorMessage: req.session.errorMessage })
  req.session.errorMessage = null
})


router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('login')
    } else {
      // If the response status is false, it means the user could not be signed up.
      // In this case, add an error message to the session and redirect back to the signup page.
      req.session.errorMessage = 'successfully completed';
      res.redirect('/signup');
    }
  })
  .catch((err) => {
    console.log(err);
    req.session.errorMessage = 'Email  already exist';
    res.redirect('/signup');
  });
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user
      res.redirect('/')
    } else {
      console.log("failed");
      req.session.loginErr ="Invalid username or password";
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart', verifyLogin, (req, res) => {
  res.render('user/cart')
})


module.exports = router;
