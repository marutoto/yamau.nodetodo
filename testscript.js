
var users = require('./models/users').getUsers();
//var counter = require('./models/counter');

var test_code = 2;

switch(test_code) {

	// ユーザ認証
	case 1 :
		users.authenticate('admin', 'admi', function () {

			// 処理

		});
		break;

	// ユーザ作成
	case 2 :
		var user_info = {
			username: '管理者',
			email: 'admin@admin.com',
			password: 'admin',
			authority: 1
		}
		users.createUser(user_info, function (err, result) {
			console.log(result);
		});

		break;

	case 3 :
		counter.increment('rooms', function (err, result) {
			console.log(result);
		});

		break;

	default :
		break;

}


