
$(function () {

	// socketコネクションを生成する
	// io.connect([URL]); URLを省略した場合、HTTPサーバと同じURLとポートが使われる
	var socket = io.connect();

	// userを作成する
	$('.modal.user-form .submit').click(function () {

		var values = getUserFormValue($('.modal.user-form form'));

		socket.emit('create-user', values);

	});

	socket.on('create-user', function (data) {

		// error
		if(data.err) {
			return;
		}

		switchUserDisplay('complete', data.user_info);

	});

	// roomを作成する
	$('.modal.room-form .submit').click(function () {

		var values = getRoomFormValue($('.modal.room-form form'));

		socket.emit('create-room', values);

	});

	socket.on('create-room', function (data) {

		// error
		if(data.err) {
			return;
		}

		switchUserDisplay('complete', data.user_info);

	});


});