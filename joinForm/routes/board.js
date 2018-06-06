var express = require('express');
var multer = require('multer');
var upload = multer({dest: './uploads/'});
var router = express.Router();
var fs = require('fs');
var session = require('express-session');

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  database: 'test',
  password: 'rlatlgns123'
});

router.get('/', function (req, res, next) {
  var sess = req.session.user_id;

  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID / : ', sess);

  res.render('index',{user_id : sess});
});

router.get('/products',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /products: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  pool.getConnection(function (err,connection){
    if (err) throw err;
    var sqlForSelectList = "SELECT name, category, color, age, price, img_link1 FROM product";
    connection.query(sqlForSelectList,function(err,rows){
      num_rows = rows.length;
      if(err) console.error("err : "+err);
  //    console.log("rows : "+JSON.stringify(rows));
      res.render('products',{user_id : sess, admin : ok_admin, row:rows, length : num_rows});
      connection.release();
    });
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {session: req.session});
})

router.post('/login', function(req, res, next){
  req.session.logined = true;

  //res.redirect('/board/products');//you should change it
  console.log('Login success');
  connection.release();
})

router.post('/index_in', function(req, res, next){
  var email = req.body.Email;
  var passwd = req.body.Password;
  var datas = [email, passwd];

  pool.getConnection(function(err, connection)
  {
    var sql = "select email, passwd from board where email=?";
    connection.query(sql, email, function(err, row){
      if(err)
      {
        console.error(err);
        console.log('No ID');
        res.send('<script>alert("해당하는 Email이 없습니다!");history.back();</script>');
        res.redirect('/board/index');
      }
      else//해당되는 아이디가 존재할 경우
      {
        /*console.log('The id is : ', row[0].email);
        console.log('The passwd is : ', row[0].passwd);*/
        console.log('The passwd is : ', row[0]);
        if(row[0].passwd == passwd)//로그인 성공 경우
        {
          console.log('password match');
          req.session.user_id = email;
          console.log('############################USER ID : ', req.session.user_id);

          res.send('<script>alert("정상 로그인되었습니다!");location.href="/board/index";</script>');
        //  res.redirect('/board/mail');
        }
        else//로그인 실패
        {
          res.send('<script>alert("비밀번호가 틀립니다!");history.back();</script>');
          //window.location.href="/board/mail";
          console.log('invalid password');
          //res.redirect('/board/mail');
        }
      }
      connection.release();
    });
  });
});


router.post('/logout',function(req,res){
  req.session.destroy(function(err){
    if(err) console.error('err',err);
    res.send('<script>alert("로그아웃 되었습니다.!");location.href="/board/index";</script>');
  });
});
/*
router.get('/index_up', function(req, res, next){//sign up
  res.render('index_up', {title : "index_up"});
});*/
router.post('/index_up', function(req, res, next) {
  var name = req.body.Name;
  var email = req.body.Email;
  var passwd = req.body.Password;
  var passwd_confirm = req.body.Password_confirm;
  var age=req.body.Age;

  var datas = [name, email, passwd, passwd_confirm, age];
  console.log(datas);
  if( passwd != passwd_confirm){
    res.send('<script>alert("Password is not Same.");history.back();</script>' );
  }
  else{
    pool.getConnection(function (err, connection)
    {
      var sqlForInsertBoard = "insert into board (name, email, passwd, passwd_confirm, age) values(?,?,?,?,?)";
      connection.query(sqlForInsertBoard,datas, function(err,rows) {
        if(err){
          console.error("err : " + err);
          res.send('<script>alert("Password is not Same.");history.back();</script>' );
        }
        else{
          res.send('<script>alert("Sign up Success!! Welcome");history.back();</script>' );
        }
        connection.release();
      });
    });
  }
});

router.get('/products1',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /products1: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('products1',{user_id : sess, admin : ok_admin});
});

router.get('/products2',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /products2: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('products2',{user_id : sess, admin : ok_admin});
});

router.get('/single',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /single: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('single',{user_id : sess, admin : ok_admin});
});

router.post('/single', function(req, res, next) {
  var sess = req.session.user_id;
  var name = req.body.Search;
  var datas = [name];//db에 등록한 상품 중에서 있는지 봐야겠네

  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /about: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  pool.getConnection(function(err, connection)
  {
    var sql = "select name, price, img_link1, img_link2, description, review from product where name=?";//product db name 중에서 key를 찾기
    connection.query(sql, [name], function(err, row){
      if(err)
      {
        console.error(err);
        console.log('No Product');
        res.redirect('/board/products');
      }
      else//해당되는 제품이 존재할 경우
      {
        console.log("rows : " + JSON.stringify(row));
        console.log('The productname is : ', row[0].name);
        console.log('@@@@@@@@@@@@@', row[0].price);
        console.log('@@@@@@@@@@@@@', row[0].img_link1);
        console.log('@@@@@@@@@@@@@', row[0].img_link2);
        console.log(row[0].description);
        console.log(row[0].review)

       //그 제품 창 띄워줘야함..!
        //res.redirect('/board/' + row[0].name);
        res.render('single',{user_id : sess, admin : ok_admin, name : row[0].name, price : row[0].price, img_link1 : row[0].img_link1, img_link2 : row[0].img_link2, description : row[0].description, review : row[0].review});
        //res.redirect('/board/single')
      }
      connection.release();
    });
  });
});

router.get('/about',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /about: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('about',{user_id : sess, admin : ok_admin});
});

router.get('/faq',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /faq: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('faq',{user_id : sess, admin : ok_admin});
});

router.get('/icons',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /icons: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('icons',{user_id : sess, admin : ok_admin});
});

router.get('/index',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /index: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('index',{user_id : sess, admin : ok_admin});
});

router.get('/mail',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /mail: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('mail',{user_id : sess, admin : ok_admin});
});

router.get('/codes',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /codes: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('codes',{user_id : sess, admin : ok_admin});
});

router.get('/mypage',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";

  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /mypage: ', sess);

  if(sess==null){
    sess="no";

    res.render('mypage',{user_id : sess, admin : "no"});
  }
  else{
    if(ok_admin != sess) ok_admin = "no";

    pool.getConnection(function(err, connection){
      if(err) console.error("커넥션 객체 얻어오기 에러 : "+err);
      var sql = "select name, email, passwd, age from board where email=?";
      connection.query(sql,[sess],function(err, rows){
        if(err) console.error(err);
        console.log("마이페이지 셀렉 결과 확인 : "+JSON.stringify(rows));

        res.render('mypage',{user_id : sess, admin : ok_admin, name : rows[0].name, email : rows[0].email, passwd : rows[0].passwd, age : rows[0].age});

        connection.release();
      });
    });
  }
});

router.get('/change_passwd',function(req,res,next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com"
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /change_passwd: ', sess);
  if(sess != ok_admin) ok_admin = "no";

  if(sess==null){
    sess="no";
    res.render('mypage',{user_id : sess, admin : ok_admin});
  }
  else{
    pool.getConnection(function(err, connection){
      if(err) console.error("커넥션 객체 얻어오기 에러 : "+err);
      var sql = "select name, email, passwd, age from board where email=?";
      connection.query(sql,[sess],function(err, rows){
        if(err) console.error(err);
        console.log("마이페이지 셀렉 결과 확인 : "+JSON.stringify(rows));
        res.render('change_passwd',{user_id : sess,admin : ok_admin,name : rows[0].name, email : rows[0].email, passwd : rows[0].passwd, age : rows[0].age});

        connection.release();
      });
    });
  }
});

router.post('/change_passwd', function(req, res, next) {
  var sess = req.session.user_id;
  var current = req.body.current;
  var _new = req.body.new;
  var confirm = req.body.confirm;
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /change_passwd: ', sess);

  if(_new != confirm){
    res.send('<script>alert("Password is not Same.");history.back();</script>' );
  }
  else{
    pool.getConnection(function(err, connection){
      var sql = "update board set passwd=?, passwd_confirm=? where email=? and passwd=?";
      connection.query(sql,[_new,confirm,sess,current],function(err, result){
        console.log(result);
        if(err) console.error("글 수정 중 에러 발생 err : "+err);

        if(result.affectedRows==0){
          res.send('<script>alert("Password is not correct, or wrong request.");history.back();</script>');
        }
        else{
          res.send('<script>alert("정상 로그인되었습니다!");location.href="/board/mypage";</script>');
        }
        connection.release();
      });
    });
  }
});


router.get('/search', function(req, res, next){//검색기능..
  var sess = req.session.user_id;
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /search: ', sess);

  res.render('search',{user_id : sess});
});

router.get('/cart', function(req, res, next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /index: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('index',{user_id : sess, admin : ok_admin});
});

router.post('/cart', function(req, res, next) {
  var name = req.body.item;
  var price = req.body.price;
  var datas = [name, price];

  pool.getConnection(function (err, connection)
  {
    var sqlForInsertBoard = "insert into cart (name, price) values(?,?)";
    connection.query(sqlForInsertBoard,datas, function(err,rows) {
      if(err) console.error("err : " + err);
    //  console.log("rows : " + JSON.stringify(rows));
      res.redirect('/board/products');//you should change it
      connection.release();
    });
  });
});

router.get('/Product_add', function(req, res, next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /Product_add: ', sess);

  if(sess!=ok_admin) ok_admin = "no"

  res.render('Product_add',{user_id : sess, admin : ok_admin});
});


router.post('/Product_add', upload.array('img',2), function(req,res){
  var name = req.body.name;
  var category = req.body.category;
  var color = req.body.color;
  var age = req.body.age;
  var price = req.body.price
  var uploadCnt = 0;
  var upFile = req.files;

  var file_name_1 = '/images/';
  var file_name_2 = '/images/';
  if(upFile[0]!=null){
    var mimetype_1 = upFile[0].mimetype.split('/')[1];
    file_name_1 += upFile[0].filename;
    file_name_1 += '.';
    file_name_1 += mimetype_1;

  }
  if(upFile[1]!=null){
    var mimetype_2 = upFile[1].mimetype.split('/')[1];
    file_name_2 += upFile[1].filename;
    file_name_2 += '.';
    file_name_2 += mimetype_2;
  }



  var datas = [name, category, "/",color, age,price, file_name_1, file_name_2];

  console.log('upFile : '+datas);
  pool.getConnection(function (err,connection){
    var sqlForInsertBoard = "insert into product(name, category, link,color, age,price,img_link1, img_link2) values(?, ?, ?, ?, ?, ?,?,?)";
    connection.query(sqlForInsertBoard,datas,function(err, rows){
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.send('<script>alert("Add Success!");location.href="/board/Product_add";</script>');
      connection.release();
    });
  });

});

router.get('/Product_delete', function(req, res, next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  var num_rows = 0;
  if(sess==null){
    sess="no";
  }
//  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /Product_delete: ', sess);

  if(sess!=ok_admin) ok_admin = "no"


  pool.getConnection(function (err,connection){
    if (err) throw err;
    var sqlForSelectList = "SELECT name, category, color, age, price, img_link1 FROM product";
    connection.query(sqlForSelectList,function(err,rows){
      num_rows = rows.length;
      if(err) console.error("err : "+err);
  //    console.log("rows : "+JSON.stringify(rows));
      res.render('Product_delete',{user_id : sess, admin : ok_admin, row:rows, length : num_rows});
      connection.release();
    });
  });
});

router.post('/Product_delete', function(req,res){
  var name = req.body.checked;

  if(name[1].length == name[0].length && name[0].length==1){
    pool.getConnection(function (err,connection){
      var sqlForDeleteBoard = "delete from product where name=?";
      var datas = [name];
      console.log('%%%%%%%%%%%%%%%%  '+name);
      connection.query(sqlForDeleteBoard,datas,function(err, rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        connection.release();
      });
    });
  }
  else{
    var sqlForDeleteBoard = "delete from product where name=?";
      pool.getConnection(function (err,connection){
        for(var i=0;i<name.length;i++){
          var copy = JSON.parse(JSON.stringify(name[i]));
          connection.query(sqlForDeleteBoard,copy,function(err, rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));
            if(i==name.length-1)connection.release();

          });

      }
    });
  }
  res.send('<script>alert("Delete Success!");location.href="/board/Product_delete";</script>');
});

router.get('/Product_update', function(req, res, next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"

  pool.getConnection(function (err,connection){
    if (err) throw err;
    var sqlForSelectList = "SELECT name, category, color, age, price, img_link1 FROM product";
    connection.query(sqlForSelectList,function(err,rows){
      num_rows = rows.length;
      if(err) console.error("err : "+err);
  //    console.log("rows : "+JSON.stringify(rows));
      res.render('Product_update',{user_id : sess, admin : ok_admin, row:rows, length : num_rows});
      connection.release();
    });
  });
});

router.post('/Product_update', function(req,res){
  var name = req.body.checked;
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"

  if(name[1].length == name[0].length && name[0].length==1){
    pool.getConnection(function (err,connection){
      var sqlForSelectBoard = "SELECT name, category, color, age, price, img_link1, img_link2 FROM product where name=?";
      var datas = [name];
      console.log('%%%%%%%%%%%%%%%%  '+name);
      connection.query(sqlForSelectBoard,datas,function(err, rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        res.render('for_modify',{user_id : sess, admin : ok_admin, row:rows});
        connection.release();
      });
    });
  }
});

router.post('/for_modify', function(req,res){
  var real = req.body.real;
  var name = req.body.p_name;
  var color = req.body.p_color;
  var category = req.body.p_category;
  var age = req.body.p_age;
  var price = req.body.p_price;

  var datas = [name,color,category,age,price,real];
  pool.getConnection(function (err,connection){
    var sql = "update product set name=?, color=?, category=?, age=?, price=? where name=?";
    connection.query(sql,datas,function(err, result){
      console.log(result);
      if(err) console.error("글 수정 중 에러 발생 err : "+err);

      if(result.affectedRows==0){
        res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>" );
      }
      else{
        res.send('<script>alert("Modify Success!");location.href="/board/Product_update";</script>');
      }
      connection.release();
    });
  });
});

router.get('/products_phone', function(req, res, next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"

  pool.getConnection(function (err,connection){
    if (err) throw err;
    var sqlForSelectList = "SELECT name, category, color, age, price, img_link1, img_link2 FROM product where category=?";
    connection.query(sqlForSelectList,"phone",function(err,rows){
      if(err) console.error("err : "+err);
  //    console.log("rows : "+JSON.stringify(rows));
      res.render('products_phone',{user_id : sess, admin : ok_admin, row:rows});
      connection.release();
    });
  });
});

router.get('/products_pc', function(req, res, next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"

  pool.getConnection(function (err,connection){
    if (err) throw err;
    var sqlForSelectList = "SELECT name, category, color, age, price, img_link1, img_link2 FROM product where category=?";
    connection.query(sqlForSelectList,"pc",function(err,rows){
      if(err) console.error("err : "+err);
  //    console.log("rows : "+JSON.stringify(rows));
      res.render('products_pc',{user_id : sess, admin : ok_admin, row:rows});
      connection.release();
    });
  });
});

router.get('/products_acc', function(req, res, next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"

  pool.getConnection(function (err,connection){
    if (err) throw err;
    var sqlForSelectList = "SELECT name, category, color, age, price, img_link1, img_link2 FROM product where category=?";
    connection.query(sqlForSelectList,"acc",function(err,rows){
      if(err) console.error("err : "+err);
  //    console.log("rows : "+JSON.stringify(rows));
      res.render('products_acc',{user_id : sess, admin : ok_admin, row:rows});
      connection.release();
    });
  });
});

router.get('/products_home', function(req, res, next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"

  pool.getConnection(function (err,connection){
    if (err) throw err;
    var sqlForSelectList = "SELECT name, category, color, age, price, img_link1, img_link2 FROM product where category=?";
    connection.query(sqlForSelectList,"home",function(err,rows){
      if(err) console.error("err : "+err);
  //    console.log("rows : "+JSON.stringify(rows));
      res.render('products_home',{user_id : sess, admin : ok_admin, row:rows});
      connection.release();
    });
  });
});

router.get('/products_speaker', function(req, res, next){
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"

  pool.getConnection(function (err,connection){
    if (err) throw err;
    var sqlForSelectList = "SELECT name, category, color, age, price, img_link1, img_link2 FROM product where category=?";
    connection.query(sqlForSelectList,"speaker",function(err,rows){
      if(err) console.error("err : "+err);
  //    console.log("rows : "+JSON.stringify(rows));
      res.render('products_speaker',{user_id : sess, admin : ok_admin, row:rows});
      connection.release();
    });
  });
});

router.post('/p_single', function(req, res, next) {
  var sess = req.session.user_id;
  var name = req.body.p_Search;
  var datas = [name];//db에 등록한 상품 중에서 있는지 봐야겠네
  var ok_admin = "tkarnr0926@gmail.com";
  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"
  pool.getConnection(function(err, connection)
  {
    var sql = "select name, price, img_link1, img_link2, description, review from product where name=?";//product db name 중에서 key를 찾기
    connection.query(sql, [name], function(err, row){
      if(err)
      {
        console.error(err);
        console.log('No Product');
        res.redirect('/board/products');
      }
      else//해당되는 제품이 존재할 경우
      {
        console.log("rows : " + JSON.stringify(row));
        console.log('The productname is : ', row[0].name);
        console.log('@@@@@@@@@@@@@', row[0].price);
        console.log('@@@@@@@@@@@@@', row[0].img_link1);
        console.log('@@@@@@@@@@@@@', row[0].img_link2);

       //그 제품 창 띄워줘야함..!
        //res.redirect('/board/' + row[0].name);
        res.render('p_single',{user_id : sess, admin : ok_admin, name : row[0].name, price : row[0].price, img_link1 : row[0].img_link1, img_link2 : row[0].img_link2, description : row[0].description, review : row[0].review});
        //res.redirect('/board/single')
      }
      connection.release();
    });
  });
});

router.get('/mycart',function(req,res,next){//카트에 담긴 물건 보여줌
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";

  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /mycart: ', sess);
//  res.render('mycart',{user_id : sess});
  //var name = req.body.Search;
  //var datas = [name];//db에 등록한 상품 중에서 있는지 봐야겠네
  pool.getConnection(function(err, connection)
  {
    var sql = "select * from cart";//db의 모든 제품 가져오기
    connection.query(sql, function(err, row){
      if(err)
      {
        console.error(err);
        //검색한 물품이 없을 때
        res.redirect('/board/products');
      }
      else//해당되는 제품이 존재할 경우
      {
        console.log("rows : " + JSON.stringify(row));
        res.render('mycart', {user_id : sess, row:  row, admin : ok_admin});
       //그 제품 창 띄워줘야함..!
        //res.redirect('/board/' + row[0].name);
        //res.render('mycart',{user_id : sess, name : row[0].name, price : row[0].price, img_link1 : row[0].img_link1, img_link2 : row[0].img_link2});
        //res.redirect('/board/single')
      }
      connection.release();
    });
  });
});
router.post('/mycart', function(req,res){
  var name = req.body.checked;
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";

  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@USER ID /mycart: ', sess);
  console.log('@!#@!#!@# : '+name);

  pool.getConnection(function (err,connection){
    var sqlForInsertBoard = "insert into myorder(name) values(?)";
    var datas = [name,];
    connection.query(sqlForInsertBoard,datas,function(err, rows){
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));
      connection.release();
    });
  });
  res.send('<script>alert("Order Success!");location.href="/board/mycart";</script>');
});
router.get('/orderlist',function(req,res,next){//카트에 담긴 물건 보여줌
  var sess = req.session.user_id;
  var ok_admin = "tkarnr0926@gmail.com";

  if(sess==null){
    sess="no";
  }

  if(sess!=ok_admin) ok_admin = "no"
//  res.render('mycart',{user_id : sess});
  //var name = req.body.Search;
  //var datas = [name];//db에 등록한 상품 중에서 있는지 봐야겠네
  pool.getConnection(function(err, connection)
  {
    var sql = "select * from myorder";//db의 모든 제품 가져오기
    connection.query(sql, function(err, row){
      if(err)
      {
        console.error(err);
        //검색한 물품이 없을 때
        res.redirect('/board/products');
      }
      else//해당되는 제품이 존재할 경우
      {
        console.log("rows : " + JSON.stringify(row));
        res.render('orderlist', {user_id : sess, row:  row,admin : ok_admin});
       //그 제품 창 띄워줘야함..!
        //res.redirect('/board/' + row[0].name);
        //res.render('mycart',{user_id : sess, name : row[0].name, price : row[0].price, img_link1 : row[0].img_link1, img_link2 : row[0].img_link2});
        //res.redirect('/board/single')
      }
      connection.release();
    });
  });
});
module.exports = router;
