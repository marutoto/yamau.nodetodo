
var Users = require('../models/users');
var Rooms = require('../models/rooms');
var Entries = require('../models/entries');

// socket.ioの接続イベントをapp.jsから切り分けた
exports.onConnection = function (socket) {
                                 // ↑ クライアントからの「socket」オブジェクト
	//socket.emit('hello', function () {});

	// userを作成するイベント
	socket.on('create-user', function (data) {

		Users.createUser(data, function (err, result) {
			var data = {
				err: false,
				user_info: {
					username: result.username,
					email: result.email,
					authority: result.authority
				}
			};
			socket.emit('create-user', data);
		});
	});

	// roomを作成するイベント
	socket.on('create-room', function (data) {

		Rooms.createRoom(data, function (err, result) {


			Entries.createEntry('entries', function (err, collection) {
				if(err) {
					callback(err);
					return;
				}
				var entry_users = result.entry_users;
				for(var i=0; i<entry_users.length; i++) {
					collection.createEn(result._id, entry_users[i], function () {
						//
					});
				}

			});

			Rooms.findEntryUsername(result, function (err, entry_members) {

				var entry_members_name = '';
				for(var i=0; i<entry_members.length; i++) {
					entry_members_name += entry_members[i].username + ' / ';
				}

				var data = {
					err: false,
					room_info: {
						roomname: result.roomname,
						member_ids: entry_members_name
					}
				};
				socket.emit('create-room', data);

			});
		});
	});



};



