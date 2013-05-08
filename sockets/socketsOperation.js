
var users = require('../models/users').getUsers();
var rooms = require('../models/rooms').getRooms();

// socket.ioの接続イベントをapp.jsから切り分けた
exports.onConnection = function (socket) {
                                 // ↑ クライアントからの「socket」オブジェクト
	//socket.emit('hello', function () {});

	// userを作成するイベント
	socket.on('create-user', function (data) {

		users.createUser(data, function (err, result) {
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

		rooms.createRoom(data, function (err, result) {

			rooms.findEntryUsername(result, function (err, entry_members) {

				var entry_members_name = '';
				for(var i=0; i<entry_members.length; i++) {
					entry_members_name += entry_members[i].username + ' / ';
				}

				var data = {
					err: false,
					room_info: {
						roomname: result.roomname,
						entry_members: entry_members_name
					}
				};
				socket.emit('create-room', data);

			});
		});
	});



};



