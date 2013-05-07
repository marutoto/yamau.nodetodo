
var database = require('./database');
var db = database.createDatabaseClient();
var BSON = require('mongodb').pure().BSON;
var rooms = exports;

// ルームクラス
var Rooms = function () {};


Rooms.prototype.findRooms = function (name, password, callback) {

	// usersコレクションオブジェクトを取得する
	db.getCollection('users', function (err, collection) {

		if(err) {
			callback(err);
			return;
		}

		var cursor = collection.find({name: name});
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
					//console.log('found.');
					return;
				}
			}

			// 該当ユーザなし
			err = true;
			callback(err, null);
			//console.log('not found.');

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
 * ルームを作成する
 * @param room_info
 * @param callback
 */
Rooms.prototype.createRoom = function (room_info, callback) {

	// roomsコレクションオブジェクトを取得する
	db.getCollection('rooms', function (err, collection) {
		if(err) {
			callback(err);
			return;
		}
		var new_room = {
			name: room_info.roomname,
			entry_members: room_info.entry_members
		};
		collection.insert(new_room, function (err, result) {
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
 * roomに所属するuser名を取得する
 * @param result
 * @param callback
 */
Rooms.prototype.findEntryUsername = function (result, callback) {

	// roomsコレクションオブジェクトを取得する
	db.getCollection('rooms', function (err, collection) {
		if(err) {
			callback(err);
			return;
		}

		var ObjectID = require('mongodb').ObjectID;
		//var objectId = new ObjectID();

		console.log(result.entry_members[0]);
		console.log(ObjectID(result.entry_members[0]));

		console.log(typeof result.entry_members[0]);
		console.log(typeof ObjectID(result.entry_members[0]));
		//console.log(new MongoId(result.entry_members[0]));
		//console.log(BSON.ObjectId.from_string);

		//console.log('pass', ObjectID.createFromHexString(result.entry_members[0]));
		//return;

		// user名を取得する
		var _ids = [];
		/*for(var i=0; i<result.entry_members.length; i++) {
			console.log(result.entry_members[i]);
			//console.log(result.entry_members[i].createFromHexString());
			//console.log(result.entry_members[i].toHexString());
			_ids.push(result.entry_members[i]);
		}*/
		_ids.push(ObjectID(result.entry_members[0]));
		//var query = {_id: {$in: _ids}};
		var query = {_id: ObjectID(result.entry_members[0])};
		console.log('query', query);

		var cursor = collection.find(query);
		cursor.toArray(function (err, result) {
			db.closeDb();
			if(err) {
				callback(err);
				return;
			}
			console.log('result', result);
			return;
			callback(err, result);
		});


	});

};

/**
 * インスタンスを生成する
 */
rooms.getRooms = function () {
	return new Rooms();
};

function _hashPassword(password) {

	if(password === '') return '';

	var shasum = crypto.createHash('sha256');
	shasum.update(password);
	return shasum.digest('hex');

}