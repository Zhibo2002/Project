var express = require('express');
var router = express.Router();

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('597856985344-7ta2asgmmao52ciqd61pi5jul6gqtk97.apps.googleusercontent.com');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});


router.get('/test', function(req, res, next) {
  if ('user' in req.session) {
    res.json(req.session.user);
  } else {
    res.send('this is test');
  }
});

let users = {
  admin: { username: "admin", password: "password123"},
  alice: { username: "alice", password: "horse"},
}

router.post('/login', function(req, res, next) { // 54

  // check
  //console.log(req.body); 77

  if ('username' in req.body && 'password' in req.body){

    req.pool.getConnection(function(err, connection) { // 56
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      let query = "SELECT user_id, username, email, last_login, login_ip FROM users WHERE username = ? AND password = ?;"; // 63
      connection.query(query,[req.body.username,req.body.password], function(err, rows, fields) {
        connection.release(); // 释放请求res.sendStatus(500);
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        if(rows.length > 0)
        {
          console.log('log in success');
          req.session.user = rows[0]; //
          res.sendStatus(200);
        } else {
          console.log('bad login'); // 不匹配，登录失败
          res.sendStatus(401);
        }
        //res.json(rows); //发送请求 71
      });

    }); //74

  } else if ('token' in req.body) {

    let email = null;

    async function verify() { // 94
      const ticket = await client.verifyIdToken({
          idToken: req.body.token,
          audience: '597856985344-7ta2asgmmao52ciqd61pi5jul6gqtk97.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      console.log(userid);
      email = payload['email'];
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
    }
    verify().then(function() {

      req.pool.getConnection(function(err, connection) { // 56
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        let query = "SELECT user_id, username, email, last_login, login_ip FROM users WHERE email = ?;"; // 63
        connection.query(query,[email], function(err, rows, fields) {
          connection.release(); // 释放请求res.sendStatus(500);
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          if(rows.length > 0)
          {
            console.log('log in success');
            req.session.user = rows[0]; //
            res.sendStatus(200);
          } else {
            console.log('bad login'); // 不匹配，登录失败
            res.sendStatus(401);
          }
          //res.json(rows); //发送请求 71
        });

      }); //135
    }).catch(function() {
      res.sendStatus(401);
    });


  } else {
    console.log('bad request')
    res.sendStatus(400);
  }

});





























router.post('/signup', function(req, res, next) {
  console.log(req.body);

  if ('username' in req.body && 'password' in req.body){

    req.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      let query = "INSERT INTO users (username,password) VALUES(?,?);"; // 107
      connection.query(query,[req.body.username,req.body.password,req.body.username,req.body.password], function(err, rows, fields) {
        if (err) {
          console.log(err);
          res.sendStatus(403);
          return;
        }
        let query = "SELECT user_id, username, email, last_login, login_ip FROM users WHERE username = ? AND password = ?;";
        connection.query(query,[req.body.username,req.body.password], function(err, rows, fields) {
          connection.release(); // 释放请求116
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
        if(rows.length > 0) {
          console.log('log in success');
          req.session.user = rows[0]; //
          res.sendStatus(200);
        } else {
          console.log('bad login'); // 不匹配，登录失败
          res.sendStatus(401);
        }
        //res.json(rows); //发送请求 71
      });

    }); //74

  });


  } else {
    console.log('bad request')
    res.sendStatus(400);
  }


});

router.post('/logout', function(req, res, next) {
  if ('user' in req.session) {
    delete req.session.user;
  }

  res.end();
});



// If user not login, request get reject, if user login request continue
// router.use('/path'function(req,res,next){
//   if(!('user' in req.session)){
//     res.sendStatus(403);
//   } else {
//     next();
//   }
// });

/*从数据库读取所有events信息*/
router.get('/events', function(req, res, next) {
  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM event;";
    connection.query(query, function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });

  });

});

/*从数据库读取user添加的events*/
router.get('/user/events', function(req, res, next) {

  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "SELECT * FROM events WHERE user_id=?;";
    connection.query(query, function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });

  });

});


/*add event to database  lecture视频1:27*/
router.post('/event/new',function(req,res,next){

// console.log(req.body);
  // post_list.push(req.body);

  // res.end();

  req.pool.getConnection(function(error,connection){
    if(error){
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let query = "INSERT INTO EVENT(event_id,event_title,event_description,event_time,event_location)VALUES(?,?,?,?,?,?);";
    //下面query内的变量在page。js里

    connection.query(query,[1,req.body.event-title,req.body.event-content,req.body.event-datetime,req.body.location], function(error, rows, fields) {
      connection.release(); // release connection
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});


module.exports = router;