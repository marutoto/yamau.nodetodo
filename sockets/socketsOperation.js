
// socket.ioの接続イベントをapp.jsから切り分けた
exports.onConnection = function (socket) {
                                 // ↑ クライアントからの「socket」オブジェクト
	//socket.emit('hello', function () {});

	// userを作成するイベント
	socket.on('create-user', function (data) {
		var users = require('../models/users').getUsers();
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
		var rooms = require('../models/rooms').getRooms();
		rooms.createRoom(data, function (err, result) {

			//console.log(result);



			rooms.findEntryUsername(result, function (err, entry_members) {

				var data = {
					err: false,
					room_info: {
						roomname: result.roomname,
						entry_members: entry_members
					}
				};

			});
		});
	});



};



