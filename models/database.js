
var mongodb = require('mongodb');
var config = require('../config');
var database = exports;

/**
 * データベースクラス
 * @constructor
 */
var Database = function () {};

/**
 * データベースへ接続する為のオブジェクトを取得する
 * @param database_name
 * @param callback 実行するクエリを定義した関数。「err」「データベースへの接続用オブジェクト」を引数に取る
 * @private
 */
Database.prototype._openDb = function (database_name, callback) {

	var self = this;

	if(this._db && !this._db.close) {
		callback(null, this._db);
		return;
	}

	var host = config.databaseAuth.host;
	var port = config.databaseAuth.port;
	var server = new mongodb.Server(host, port);
	var db_connector = new mongodb.Db(database_name, server, {safe: true});

	db_connector.open(function (err, db) {
		if(err) {
			callback(err);
			return;
		}
		self._db = db;
		callback(null, db);
		//              ↑コレコレ
	});

};

/**
 * コレクションへ接続する為のオブジェクトを取得する
 * @param collection_name
 * @param callback 実行するクエリを定義した関数。「err」「コレクションへの接続用オブジェクト」を引数に取る
 */
Database.prototype.getCollection = function (collection_name, callback) {

	var databaseName = config.databaseAuth.database;
	this._openDb(databaseName, function (err, db) {
		//                                          ↑コレコレ
		if(err) {
			callback(err);
			return;
		}
		db.createCollection(collection_name, callback);

	});

};

/**
 * データベース接続をクローズする
 */
Database.prototype.closeDb = function () {

	if(this._db) {
		this._db.close();
		delete this._db;
	}

};


/**
 * インスタンスを生成する
 */
database.getDatabaseClient = function () {
	return new Database();
};

