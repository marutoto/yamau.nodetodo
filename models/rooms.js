
var database = require('./database');
var db = database.createDatabaseClient();
var ObjectID = require('mongodb').ObjectID;
var rooms = exports;

// Roomsクラス
var Rooms = function () {};

/**
 * roomを取得する
 * @param query
 * @param callback
 */
Rooms.prototype.findRooms = function (query, callback) {

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
			name: room_info.roomname
			//entry_members: room_info.entry_members
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

	// usersコレクションオブジェクトを取得する
	db.getCollection('users', function (err, collection) {
		if(err) {
			callback(err);
			return;
		}

		// user名を取得する
		var _ids = [];
		for(var i=0; i<result.entry_members.length; i++) {
			_ids.push(ObjectID.createFromHexString(result.entry_members[i]));
		}

		var query = {_id: {$in: _ids}};
		var cursor = collection.find(query);
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