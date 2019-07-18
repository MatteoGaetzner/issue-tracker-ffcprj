/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    MongoClient.connect(MONGODB_CONNECTION_STRING, async function(err, db) {
      if(err){console.log(err)}
      var result = await db.collection('books').find({}).toArray()
      res.send(result)
    })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      var newBook = {
        title: req.body.title
      }
      MongoClient.connect(MONGODB_CONNECTION_STRING, async function(err, db) {
        if(err){console.log(err)}
        await db.collection('books').insertOne(newBook)
        var foundDoc = await db.collection('books').findOne({title: title})
        res.send(foundDoc)
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
      if(err){console.log(err)}
      db.collection('books').remove({})
      res.send('complete delete successfull')
    })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    MongoClient.connect(MONGODB_CONNECTION_STRING, async function(err, db) {
      if(err){console.log(err)}
      try{
        var resBook = await db.collection('books').findOne({_id: ObjectId(bookid)})
        res.json({
          _id: ObjectId(resBook._id),
          title: resBook.title,
          comments: resBook.comments
        })
      } catch(err) {
        res.send('no book exists')
      }
    })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    MongoClient.connect(MONGODB_CONNECTION_STRING, async function(err, db) {
      if(err){console.log(err)}
      try{
        var originalBook = await db.collection('books').findOne({_id: ObjectId(bookid)})

        if(originalBook.comments){
          var updatedBook = await db.collection('books').findOneAndUpdate(
            {_id: ObjectId(bookid)},
            { $set: {
              comments: [...originalBook.comments, comment]
            }},
            {returnNewDocument: true}
          )
          console.log(updatedBook.value)
        } else {
          var updatedBook = await db.collection('books').findOneAndUpdate(
            {_id: ObjectId(bookid)},
            { $set: {
              comments: [comment]
            }},
            {returnNewDocument: true}
          )  
          console.log(updatedBook.value)
        }
        res.json(updatedBook.value)
      } catch(err) {
        res.send('no book exists')
      }
    })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
      if(err){console.log(err)}
      try{
        db.collection('books').removeOne({_id: ObjectId(bookid)})
        res.send('delete successful')
      } catch(err) {
        res.send('no book exists')
      }
    })
    });
  
};
