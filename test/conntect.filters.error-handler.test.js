
/**
 * Module dependencies.
 */

var connect = require('connect'),
    helpers = require('./helpers'),
    assert = require('assert'),
    http = require('http');

module.exports = {
    'test defaults': function(){
        var server = helpers.run([
            { module: {
                handle: function(err, req, res, next){
                    next(new Error('keyboard cat!'));
                }
            }},
            { filter: 'error-handler' }
        ]);
        server.assertResponse('GET', '/', 500, 'Internal Server Error', 'Test error-handler defaults');
    },
    
    'test showMessage': function(){
        var server = helpers.run([
            { module: {
                handle: function(err, req, res, next){
                    next(new Error('keyboard cat!'));
                }
            }},
            { filter: 'error-handler', showMessage: true }
        ]);
        server.assertResponse('GET', '/', 500, 'Error: keyboard cat!', 'Test error-handler showMessage');
    },
    
    'test showStack': function(){
        var server = helpers.run([
            { module: {
                handle: function(err, req, res, next){
                    next(new Error('keyboard cat!'));
                }
            }},
            { filter: 'error-handler', showStack: true }
        ]);
        var req = server.request('GET', '/');
        req.buffer = true;
        req.addListener('response', function(res){
            res.addListener('end', function(){
                assert.equal(500, res.statusCode, 'Test error-handler 500 status code');
                assert.ok(res.body.indexOf('Error: keyboard cat!') !== -1, 'Test error-handler showStack message');
                assert.ok(res.body.indexOf('lib/connect/index.js') !== -1, 'Test error-handler showStack stack trace');
            })
        })
        req.end();
    }
}