var fs = require('fs');
var path = require("path");
var args = process.argv.slice(2);
var Subtitle = require('../subtitle');

args.forEach(function (item) {

    var captions = new Subtitle();
    var output = path.basename(item) + ".json";
    var srt = fs.readFileSync(item, 'utf8');

    captions.parse(srt);

    fs.writeFile(output, JSON.stringify(captions.getSubtitles()), function (err) {
        if (err) throw err;
        console.log('Saved!', output);
    });

});
