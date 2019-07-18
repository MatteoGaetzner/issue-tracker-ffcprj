/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      var bookObj = {
        title: 'title'
      }
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books/')
          .send(bookObj)
          .end(function(err, res){
          console.log(res.body)
          assert.isObject(res.body, 'responst should be an object')
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books/')
          .send({})
          .end(function(err, res){
          assert.isNotObject(res.body, 'responst should not be an object')
          done();
        })
      });
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books/')
          .end((err, res) => {
          assert.isArray(res.body, 'response should be an array')
          done();
        })
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/asdgasdg')
          .end((err, res) => {
           assert.notEqual(res.body, 'no book exists', 'responst should be no book exists')
          done();
        })
      });
    })
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/asdgasdg')
        .end((err, res) => {
        assert.equal(res.body, 'no book exists', 'responst should be no book exists')
        done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/5d2ee9c0874a5966a499a264')
        .send({comment: 'test comment'})
        .end((err, res) => {
          assert.isObject(res.body, 'respones should be object')
          assert.property(res.body[0], '_id', 'response object should have _id property')
          done();
        })
      });
      
    });

  });

});