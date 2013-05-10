
var database = require('./database');
var db = database.getDatabaseClient();
var ObjectID = require('mongodb').ObjectID;
var rooms = exports;

// Entriesクラス
var Entries = function () {};

/**
 * entryを取得する（全件・複数件用）
 * @param query
 * @param callback
 */
Entries.prototype.findEntries = function (query, callback) {

	db.getCollection('entries', function (err, collection) {
		if(err) {
			callback(err);
			return;
		}

		var cursor = collection.find(query);
		cursor.toArray(function (err, result) {
			db.closeDb();
			if(err) {
				callback(err);
				return;
			}
			//
		});
	});

};

Entries.prototype.findOneEntry = function (_id, callback) {

	db.getCollection('entries', function (err, collection) {
		if(err) {
			callback(err);
			return;
		}

		//                               ↓これで大丈夫？
		var cursor = collection.findOne(_id);
	});

};

Entries.prototype.createEntry = function (room_id, user_id, callback) {

	db.getCollection('entries', function (err, collection) {
		if(err) {
			callback(err);
			return;
		}

		var new_entry = {
			room_id: room_id,
			user_id: user_id
		};
		collection.insert(new_entry, function (err, result) {
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
 * インスタンスを生成する
 */
rooms.getEntries = function () {
	return new Entries();
};






