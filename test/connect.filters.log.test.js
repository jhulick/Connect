
/**
 * Module dependencies.
 */

var connect = require('connect'),
    helpers = require('./helpers'),
    assert = require('assert'),
    http = require('http');

module.exports = {
    test: function(){
        var logs = [];
        var stream = {
            write: function(str){
                logs.push(str);
            }
        }
        var orig = Date.prototype.toUTCString;
        Date.prototype.toUTCString = function(){
            return 'Thu, 27 May 2010 03:23:50 GMT';
        }
        var server = helpers.run([
            { filter: 'log', stream: stream },
            { module: require('./filters/uppercase') },
            { module: require('./providers/echo') }
        ]);
        
        var req = server.request('POST', '/', { 'User-Agent': 'ext-test', 'Referrer': 'http://google.com' });
        req.buffer = true
        req.addListener('response', function(res){
            res.addListener('end', function(){
                assert.equal('FOOBAR', res.body);
                assert.equal(
                    '127.0.0.1 - - [Thu, 27 May 2010 03:23:50 GMT] "POST / HTTP/1.1" 200 - "http://google.com" "ext-test"\n', 
                    logs[0]);
                Date.prototype.toUTCString = orig;
            })
        })
        req.write('foobar');
        req.end();
    }
}