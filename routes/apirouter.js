var express = require('express');
var router = express.Router();
var USER = require("../database/users");
var valid = require('../utils/valid');
var midleware = require("./midleware");

router.post('/user', async(req, res)  => {
    var params = req.body;
params["registerdate"] = new Date();

if (valid.checkParams(params,USER.schema.obj)!="true") {
	res.status(403).json(valid.checkParams(params,USER.schema.obj));
	return;
}
if (valid.checkPassword(params.password)!="true") {
	res.status(403).json(valid.checkPassword(params.password));
	return;
}
if (valid.checkEmail(params.email)!="true") {
	res.status(403).json(valid.checkEmail(params.email));
	return;
}
var users = new USER(params);
var result = await users.save();

res.status(200).json(result);
});



router.get("/user", (req, res) => {
    var params = req.query;
    console.log(params);
    var limit = 100;
    if (params.limit != null) {
    limit = parseInt(params.limit);
    }
    var order = -1;
    if (params.order != null) {
    if (params.order == "desc") {
    order = -1;
    } else if (params.order == "asc") {
    order = 1;
    }
    }
    var skip = 1;
    if (params.skip != null) {
    skip = parseInt(params.skip);
    }
    USER.find({}).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => {
    res.status(200).json(docs);
     });
    });


    router.patch("/user", (req, res) => {
        if (req.query.id == null) {
        res.status(300).json({
        msn: "Error no existe id"
        });
        return;
        }
        var id = req.query.id;
        var params = req.body;
        USER.findOneAndUpdate({_id: id}, params, (err, docs) => {
        res.status(200).json(docs);
        });
        });

        
    router.delete("/user", async(req, res) => {
         if (req.query.id == null) {
            res.status(300).json({
            msn: "Error no existe id"
         });
            return;
         }
         var r = await USER.remove({_id: req.query.id});
        res.status(300).json(r);
     });
 router.post("/indexlogin", async(req,res)=>{
    var body = req.body;
    if (body.name == null) {
        res.status(300).json({msn: "El nombre es necesario"});
             return;
    }
    if (body.password == null) {
        res.status(300).json({msn: "El password es necesario"});
        return;
    }
var results = await USER.find({name: body.name, password: body.password});
    if (results.length == 1) {
		var token = JWT.sign({
			exp: Math.floor(Date.now() / 1000)+(60*60),
			data: results[0].id
		},'datamongoose');

        res.status(200).json({msn: "Bienvenido " + body.name , token:token });
        return;
    }

res.status(200).json({msn: "credenciales incorrectas"});
});      
 
module.exports = router;

    



 