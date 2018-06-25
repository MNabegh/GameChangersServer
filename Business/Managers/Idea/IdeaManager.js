const Utils = require('../utils')
const express = require('express');
const fileUpload = require('express-fileupload');
const gridfs = require('../../../db/grid-fs')
const app = express();
const Idea  = require('../Idea/Models/idea');
const Team  = require('../Team/Models/team');
const User  = require('../User/Models/user');
const Challenge = require('../Admin/Models/challenge.model');

const mime = require('mime-types')
import config from '../../../config/config';

app.use(fileUpload());

function upload(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    gridfs.write(req, res);
}

function download(req, res){
    if(req.user.isJudge || req.user.teamMember + '.' + mime.extension(mime.lookup(req.body.file)) == req.body.file)
        gridfs.read(req, res);
    else
        Utils.send400("Unauthorized",res);
}

function createIdea(req, res){
    Idea.findOne({ teamName: req.user.teamMember }, (err, ret) => {
        if (err) { 
        Utils.send400(err, res); 
        return;
        }
        if(ret)
        {
            Utils.send400("This team has already submitted an idea",res);
            return;
        }else{
            gridfs.replace(req, res);
        }
    });
}

function editIdea(req, res)
{
    
    Idea.findOne({ teamName: req.user.teamMember}, (err, ret) => {
        if (err) { 
        	Utils.send400(err, res); 
        return;
        }
        if(!ret)
        {
            Utils.send400("This team does not have an idea yet.",res);
            return
        }else{

            if(req.files) {
                gridfs.replace(req, res);
            }
            else{
                console.log(req.body.title, "  ", req.body.challenge);
                Idea.update({ teamName: req.user.teamMember }, {title: req.body.title, teamName: req.user.teamMember, challenge: req.body.challenge}, { new: true, upsert: true }, function(err, doc){
                    if(err){
                        Utils.send400('Cannot perform operation.', res);
                        return;
                    }
                    res.status(200).json({
                      status: '200',
                      statustext: 'Ok',
                      idea: doc
                    });
                  });
            }
        }
    });
}
function getIdea(req, res) {
    console.log("Is admin?: ", req.user.email, req.user.email != config.admin)
    if(req.user.email != config.admin) {
        Utils.send400("Unauthorized", res);
        return;
    }
    Idea.find({teamName: req.params.teamName}, (err, idea) => {
      if(err) {
        console.log("err: ", err.message);
        Utils.send400(err.message, res);
        return
      }
      if(!idea) {
        console.log("err2: ", "not idea");
        Utils.send400("Internal server error", res);
        return
      }
        var index = 0;
        var list = []
        idea.forEach(value => {
        const query =  Team.findOne({ name: value.teamName });
        const team = query.exec( (err, team) => {
            if(err) {
                Utils.send400(err.message, res); 
            }
            User.findOne({_id: team.creator}, (err, user) => {
                if(err) {
                    Utils.send400(err.message, res); 
                }
                if(user) {
                    var val =  value.toObject();
                    val.location = user.location
                    list.push(val)
                }
                index++;
                if(index == idea.length) {
                    return res.status(200).json({
                        status : '200',
                        message: 'Success',
                        body: list[0]
                        })
                    }
                })
            });
        });    
    })
}


 function getAllIdeas(req, res) {
    console.log("Is admin?: ", req.user.email, req.user.email != config.admin)
    if(req.user.email != config.admin) {
        Utils.send400("Unauthorized", res);
        return;
    }
    Idea.find({}, (err, idea) => {
      if(err) {
        console.log("err: ", err.message);
        Utils.send400(err.message, res);
        return
      }
      if(!idea) {
        console.log("err2: ", "not idea");
        Utils.send400("Internal server error", res);
        return
      }
        var index = 0;
        var list = []
        idea.forEach(value => {
        const query =  Team.findOne({ name: value.teamName });
        const team = query.exec( (err, team) => {
            if(err) {
                Utils.send400(err.message, res); 
            }
            User.findOne({_id: team.creator}, (err, user) => {
                if(err) {
                    Utils.send400(err.message, res); 
                }
                if(user) {
                    var val =  value.toObject();
                    val.location = user.location
                    list.push(val)
                }
                index++;
                if(index == idea.length) {
                    return res.status(200).json({
                        status : '200',
                        message: 'Success',
                        body: list
                        })
                    }
                })
            });
        });    
    })
}
function getAllChallenges(req, res) {
    Challenge.find({}, (err, challenges) => {
      if(err) {
        console.log("err: ", err.message);
        Utils.send400(err.message, res);
        return
      }
        return res.status(200).json({
            status : '200',
            message: 'Success',
            body: challenges
            })
        })     
  }
module.exports = {
upload, 
download, 
createIdea, 
getIdea,
editIdea,
getAllIdeas,
getAllChallenges
}