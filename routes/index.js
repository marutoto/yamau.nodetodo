
var users = require('../models/users').getUsers();

/**
 * メインページ
 * @param req
 * @param res
 */
exports.top = function (req, res) {

	if(req.session.user === undefined) {
		//res.redirect(403, '/login');
		res.redirect('/login');
		return;
	}

	// cookie情報をmemcachedデータベースへ保存し永続化
	//req.session.save();

	// Userを全件取得する
	users.findUser(function (err, result) {

		var users = [];
		for(var i=0; i<result.length; i++) {
			users.push({
				_id: result[i]._id,
				username: result[i].username
			});
		}

		//console.log(users);

		var data = {
			page: {title: 'welcome'},
			user: req.session.user || null,
			users: users
		};
		res.render('top', data);

	});



};





