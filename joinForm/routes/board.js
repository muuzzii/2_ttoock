router.post('/Product_add', upload.array('img',2), function(req,res){
  var name = req.body.name;
  var category = req.body.category;
  var color = req.body.color;
  var age = req.body.age;
  var price = req.body.price
  var uploadCnt = 0;
  var upFile = req.files;
  var oldName_1 = "";
  var oldName_2 = "";
  var path_1 = "";
  var path_2 = "";
  var file_name_1 = '/images/';
  var file_name_2 = '/images/';
  if(upFile[0]!=null){
    var mimetype_1 = upFile[0].mimetype.split('/')[1];
    file_name_1 += upFile[0].filename;
    file_name_1 += '.';
    file_name_1 += mimetype_1;
     oldName_1 = __dirname+'/../uploads/'+upFile[0].filename;
     path_1 =  __dirname+'/../public'+file_name_1;
    fs.rename(oldName_1,path_1, function (err) { if (err) throw err; console.log('renamed complete'); });
  }
  if(upFile[1]!=null){
    var mimetype_2 = upFile[1].mimetype.split('/')[1];
    file_name_2 += upFile[1].filename;
    file_name_2 += '.';
    file_name_2 += mimetype_2;
     oldName_2 = __dirname+'/../uploads/'+upFile[1].filename;
     path_2 =  __dirname+'/../public'+file_name_2;
    fs.rename(oldName_2,path_2, function (err) { if (err) throw err; console.log('renamed complete'); });
  }



  var datas = [name, category, "/",color, age,price, file_name_1, file_name_2,"aa","bb"];

  console.log('upFile : '+datas);
  pool.getConnection(function (err,connection){
    var sqlForInsertBoard = "insert into product(name, category, link,color, age,price,img_link1, img_link2, description, review) values(?,?,?, ?, ?, ?, ?, ?,?,?)";
    connection.query(sqlForInsertBoard,datas,function(err, rows){
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.send('<script>alert("Add Success!");location.href="/board/Product_add";</script>');
      connection.release();
    });
  });

});
