var fs = require("fs");
var path = require("path");
var args = process.argv.slice(2);

args.forEach(function (item) {

    var output = path.basename(item) + ".txt";
    var stream = fs.createWriteStream(output);

    stream.once('open', function (fd) {
        require("./" + item).forEach(function (e) {
            stream.write(e.text);
            stream.write("\n");
        }, this);
        stream.end();
    });

});

