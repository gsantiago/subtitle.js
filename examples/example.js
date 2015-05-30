var Subtitle = require('../subtitle');

var fs = require('fs');
var srt = fs.readFileSync('./demo.srt', 'utf8');

var captions = new Subtitle();

captions.parse(srt);

console.log(captions.getSubtitles());
