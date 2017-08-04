const passport 	= require('passport')
      Users = require('../models/user.js');
// Login
router.post('/login', passport.authenticate('local', { 
	successRedirect: '/', 
	failureRedirect: '/login',
	failureFlash: true
}));

// Register via username and password
router.post('/register', function(req, res, next) {

	var credentials = {'username': req.body.username, 'password': req.body.password };
    
    // Валидация формы должна быть на клиенте
	// Check if the username already exists for non-social account
	Users.findOne({ username: { $regex: new RegExp(username, i)}, socialId: null })
	.then((user) => {
		if(user){
			res.send({ message: 'Username already exists' });
	        res.redirect('/register');
		} else {
			Users.create(credentials)
			then(() => {
				req.flash({ message: 'Your account has been created. Please log in' });
				res.redirect('/');
			});
		}
	});
});

// Logout
router.get('/logout', function(req, res, next) {
	// remove the req.user property and clear the login session
	req.logout();

	// destroy session data
	req.session = null;

	// redirect to homepage
	res.redirect('/');
});