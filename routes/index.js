var express = require('express');
var router = express.Router();

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

router.post('/login', function(req, res, next) {

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

  } else {
    console.log('bad request')
    res.sendStatus(400);
  }

});


router.post('/signup', function(req, res, next) {
  console.log(req.body);

  // check
  if ('username' in req.body && 'password' in req.body){
    if (req.body.username in users && users[req.body.username].password === req.body.password) {
      console.log('user exits');
      res.sendStatus(403);
    } else {
      users[req.body.username] = { username: req.body.username, password: req.body.password};
      console.log('User ' + req.body.username+" created");
      req.session.user = users[req.body.username];
      res.sendStatus(200);
    }
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


module.exports = router;