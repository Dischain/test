function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/');
	}
}

// Тут кстати провести небольшой рефакторинг кода
module.exports = {
    isAuthenticated: isAuthenticated
} 