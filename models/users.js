
var crypto = require('crypto');
var database = require('./database');
var db = database.getDatabaseClient();
var objectID = new require('mongodb').ObjectID;
var users = exports;

// Usersコレクションクラス
var Users = function () {};

/**
 * Userを全件取得する
 * @param callback
 */
Users.prototype.findUser = function (callback) {

	// usersコレクションオブジェクトを取得する
	db.getCollection('users', function (err, collection) {
		if(err) {
			callback(err);
			return;
		}

		var cursor = collection.find({});
		cursor.toArray(function (err, result) {
			db.closeDb();
			if(err) {
				callback(err);
				return;
			}
			callback(err, result);
		});
	});

};


/**
 * ユーザを作成する
 * @param user_info
 * @param callback
 */
Users.prototype.createUser = function (user_info, callback) {

	// usersコレクションオブジェクトを取得する
	db.getCollection('users', function (err, collection) {
		if(err) {
			callback(err);
			return;
		}

		// 入力されたパスワードを暗号化
		var hashed_password = _hashPassword(user_info.password);

		var new_user = {
			username: user_info.username,
			email: user_info.email,
			password: hashed_password,
			authority: user_info.authority
		};
		collection.insert(new_user, function (err, result) {
			db.closeDb();
			if(err) {
				callback(err);
				return;
			}
			callback(err, result[0]);
		});
	});
};


/**
 * ユーザ認証を行う
 * @param email
 * @param password
 * @param callback
 */
Users.prototype.authenticate = function (email, password, callback) {

	// usersコレクションオブジェクトを取得する
	db.getCollection('users', function (err, collection) {

		if(err) {
			callback(err);
			return;
		}

		var cursor = collection.find({email: email});
		cursor.toArray(function (err, result) {
			db.closeDb();
			if(err) {
				callback(err);
				return;
			}
			// 該当ユーザあり
			if(result.length > 0) {
				var user_info = result[0];
				if(user_info.password == _hashPassword(password)) {
					delete user_info.password;
					callback(null, user_info);
					return;
				}
			}

			// 該当ユーザなし
			err = true;
			callback(err, null);

		});

		/*
		// テスト
		cursor.toArray(function (err, doc) {
			console.log('get : ', doc);
		});
		cursor.count(function (err, count) {
			console.log('count : ', count);
			db.closeDb();
		});

		// DB接続動作テスト(usersコレクションに1件追加して、表示する)
		collection.insert({id: 999, name: 'yamaua'}, function (err, result) {
			console.log(result, ' : result');
			var cursor = collection.find({});
			cursor.toArray(function (err, docs) {
				console.log(docs);
			});
		});
		*/
	});
};

/**
 * インスタンスを生成する
 */
users.getUsers = function () {
	return new Users();
};

function _hashPassword(password) {

	if(password === '') return '';

	var shasum = crypto.createHash('sha256');
	shasum.update(password);
	return shasum.digest('hex');

}