
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
		email: '',
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

	var email = req.body.email || '';
	var password = req.body.password || '';

	// 入力データを検証後、コールバックでログインする
	users.authenticate(email, password, function (err, user_info) {

		// ログインに失敗
		if(err) {
			var data = {
				page: {title: 'login'},
				user: null,
				email: email,
				error: 200,
				loginFailed: true
			};
			res.render('login', data);
			return;
		}

		// ログインに成功（セッションにユーザ情報を格納）
		req.session.user = {
			uid: user_info._id,
			username: user_info.username
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






