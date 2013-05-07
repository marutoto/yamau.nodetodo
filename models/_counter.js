
var database = require('./database');
var db = database.createDatabaseClient();
var counter = exports;

/**
 * 各コレクションのカウンターを1インクリメントする(多分まだ動かない)
 * @param collection_name
 * @param callback
 */
counter.increment = function (collection_name, callback) {

	db.getCollection('counter', function (err, counter) {

		if(err) {
			callback(err);
			return;
		}

		var query = {collection_name: collection_name};
		counter.findOne(query, function (err, result) {

			// カウンターが存在しない場合、カウンターを作成
			if(!result) {
				var new_counter = {
					collection_name: collection_name,
					count: 1
				};
				counter.insert(new_counter, function (err, result) {
					callback(err, result);
				});

			// カウンターが存在する場合、1インクリメント
			} else {
				counter.findAndModify(query, {}, {$inc: {count: 1}}, function (err, result) {
					callback(err, result);
				});
			}
		});

		//counter.findAndModify()


	});

};

