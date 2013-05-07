
$(function () {

	$('a[rel*=leanModal]').leanModal({closeButton: '.close'});

	$('.user-form .re-create').click(function () {
		switchUserDisplay('re-create');
	});

	$('.room-form .re-create').click(function () {
		switchRoomDisplay('re-create');
	});

});

// モーダルで表示されたUserフォームの値を取得する
function getUserFormValue($form) {

	var values = {};

	$form.find('[name="username"]').each(function () {
		values[$(this).attr('name')] = $(this).val();
	});

	$form.find('[name="email"]').each(function () {
		values[$(this).attr('name')] = $(this).val();
	});

	$form.find('[name="password"]').each(function () {
		values[$(this).attr('name')] = $(this).val();
	});

	$form.find('[name="authority"]').each(function () {
		values[$(this).attr('name')] = $(this).val();
	});

	return values;

}

// モーダルで表示されたRoomフォームの値を取得する
function getRoomFormValue($form) {

	var values = {};

	var $temp = '';
	$temp = $form.find('[name="roomname"]');
	values[$temp.attr('name')] = $temp.val();

	$temp = $form.find('[name="entry_members"]:checked');
	var checked = [];
	$temp.each(function () {
		checked.push($(this).val());
	});
	values['entry_members'] = checked;
	return values;

}

function switchUserDisplay(mode, user_info) {

	var $form = $('.modal.user-form form');
	var $completion = $('.modal.user-form .completion');

	if(mode === 'complete') {
		// 作成したUser情報を出力
		$completion.find('.username span').text(user_info.username);
		$completion.find('.email span').text(user_info.email);
		if(user_info.authority == 1) {
			var authority = 'Administrator';
		} else {
			var authority = 'User';
		}
		$completion.find('.authority span').text(authority);

		$form.animate({'opacity': 0}, 1000);
		$completion.animate({'top': 20}, 1000);

	} else if(mode === 're-create') {
		// フォームに入力済みのデータを消去
		$form.find('[name="username"]').val('');
		$form.find('[name="email"]').val('');
		$form.find('[name="password"]').val('');

		$completion.animate({'top': -500}, 1000);
		$form.animate({'opacity': 1}, 1000);

	}

}

function switchRoomDisplay(mode, room_info) {

	var $form = $('.modal.room-form form');
	var $completion = $('.modal.room-form .completion');

	if(mode === 'complete') {
		// 作成したUser情報を出力
		$completion.find('.roomname span').text(room_info.roomname);
		$completion.find('.email span').text(room_info.email);
		if(user_info.authority == 1) {
			var authority = 'Administrator';
		} else {
			var authority = 'User';
		}
		$completion.find('.authority span').text(authority);

		$form.animate({'opacity': 0}, 1000);
		$completion.animate({'top': 20}, 1000);

	} else if(mode === 're-create') {
		// フォームに入力済みのデータを消去
		$form.find('[name="username"]').val('');
		$form.find('[name="email"]').val('');
		$form.find('[name="password"]').val('');

		$completion.animate({'top': -500}, 1000);
		$form.animate({'opacity': 1}, 1000);

	}

}



