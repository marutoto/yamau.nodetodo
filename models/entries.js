
var database = require('./database');
var db = database.createDatabaseClient();
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


/**
 * インスタンスを生成する
 */
rooms.getEntries = function () {
	return new Entries();
};






