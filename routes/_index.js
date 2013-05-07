
/*
 * GET home page.
 */
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/


// Usersクラスのインスタンスを取得する
var users = require('../models/users').getUsers();

/**
 * ログイン画面表示
 * @param req
 * @param res
 */
exports.login = function (req, res) {

	var data = {
		page: {title: 'login'},
		user: null,
		name: '',
		error: 200,
		loginFailed: false
	};
	res.render('login', data);

};

/**
 * ログインフォーム送信、ログイン処理
 * @param req
 * @param res
 */
exports.login.post = function (req, res) {

	var name = req.body.name || '';
	var password = req.body.password || '';

	// 入力データを検証後、コールバックでログインする
	users.authenticate(name, password, function (err, user_info) {

		// ログインに失敗
		if(err) {
			var data = {
				page: {title: 'login'},
				user: null,
				name: name,
				error: 200,
				loginFailed: true
			};
			console.log(data);
			res.render('login', data);
			return;
		}

		// ログインに成功（セッションにユーザ情報を格納）
		req.session.user = {
			uid: user_info._id,
			name: user_info.name
		};
		res.redirect('/');

	});

};

/**
 * ログアウト処理
 * @param req
 * @param res
 */
exports.logout = function (req, res) {

	req.session.destroy(function (err) {
		res.redirect('/');
	});

};


exports.index = function (req, res) {

	if(req.session.user === undefined) {
		//res.redirect(403, '/login');
		res.redirect('/login');
		return;
	}

	// cookie情報をmemcachedデータベースへ保存し永続化
	//req.session.save();

	res.render('top', {
		title: 'welcome',
		user: req.session.user || null
	});

};





