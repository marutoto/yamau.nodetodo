
var crypto = require('crypto');
var database = require('./database');
var db = database.getDatabaseClient();
//var objectID = new require('mongodb').ObjectID;
var users = exports;

/*******************/
/*** Usersクラス ***/
/*******************/
var Users = function () {};


/************************/
/*** instanceメソッド ***/
/************************/
/* instanceメソッド
Users.prototype.funcName = function (arg, callback) {
	// 処理
};
*/


/*********************/
/*** classメソッド ***/
/*********************/

/**
 * ユーザ認証を行う
 * @param email
 * @param password
 * @param callback
 */
users.authenticate = function (email, password, callback) {

	// usersコレクションオブジェクトを取得する
	db.getCollection('users', function (err, users_collection) {

		if(err) {
			callback(err);
			return;
		}

		var cursor = users_collection.find({email: email});
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

/**
 * Userを取得する
 * @param query
 * @param callback
 */
users.findUser = function (query, callback) {

	// usersコレクションオブジェクトを取得する
	db.getCollection('users', function (err, users_collection) {
		if(err) {
			callback(err);
			return;
		}

		var cursor = users_collection.find({});
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
users.createUser = function (user_info, callback) {

	// usersコレクションオブジェクトを取得する
	db.getCollection('users', function (err, users_collection) {
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
		users_collection.insert(new_user, function (err, result) {
			db.closeDb();
			if(err) {
				callback(err);
				return;
			}
			callback(err, result[0]);
		});
	});
};




/***********************/
/*** privateメソッド ***/
/***********************/

/**
 * 文字列をハッシュ変換する
 * @param password
 * @returns {*}
 * @private
 */
function _hashPassword(password) {

	if(password === '') return '';

	var shasum = crypto.createHash('sha256');
	shasum.update(password);
	return shasum.digest('hex');

}