var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*get user's created events*/
router.get('/user_events', function(req, res, next) {
  //select statement from the db
  req.pool.getConnection( function(err, connection){
      if (err) {
          res.sendStatus(500);
          return;
      }
      var query = "SELECT event.title, event.time,event.location FROM event INNER JOIN user ON user.user_id = event.user_id WHERE user_id=?";
      params = [log_in_user_id];

      connection.query(query, params, function(err, rows, fields){
          connection.release();
          if(err){
              res.sendStatus(500);
              return;
          }
          res.json(rows);
      });
  });
});

module.exports = router;
