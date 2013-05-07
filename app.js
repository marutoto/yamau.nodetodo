
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var socketsOperation = require('./sockets/socketsOperation');

// ルーティング用
var routes_index = require('./routes/index');
var routes_login = require('./routes/login');

//var MemcachedStore = require('connect-memcached')(express);
var MongoStore = require('connect-mongo')(express);
var config = require('./config');

var app = express();

/**
 * Configure
 */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// この位置じゃないとcookie関連処理が正しく動作しない
app.use(express.cookieParser());
app.use(express.session({
	key: 'sid',
	secret: 'sessionsecret',
	store: new MongoStore({
		db: 'nodetodo',
		//host: '120.0.0.1',
		//username: 'username',
		//passwordt: 'password',
		clear_interval: 60*60
	}),
	cookie: {
		httpOnly: false,
		maxAge: new Date(Date.now()+60*60*1000)
	}
}));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// 「development」
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * Routing
 */
//app.get('/', routes.index);
//app.get('/users', user.list);

// トップページの表示
app.get('/', routes_index.top);

// ログイン、ログアウト
app.get('/login', routes_login.login);
app.post('/login', routes_login.login.post);
app.get('/logout', routes_login.logout);


/**
 * Create Server
 */
// http.Serverクラスのインスタンスを生成
var server = http.createServer(app);

// socket.ioサーバのアタッチ
var io = require('socket.io').listen(server, {'log level': 1});

// サーバ起動
server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


/**
 * socket.IO Event (socket.ioの通信は、クライアント側の「io.connect(URL)」メソッドを実行することで開始される)
 */
// クライアントからの接続イベント
io.sockets.on('connection', socketsOperation.onConnection);


















