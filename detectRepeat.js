var fs = require('fs');
const readline = require('readline');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var arr = {
    bu: [],
    aş: []
}
// var arr =  {};
async function processLineByLine() {
    try {
        const fileStream = fs.createReadStream('./text.txt');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        for await (const line of rl) {
            if (line[18] == "-") {
                var nameIndex = line.indexOf(" - ")
                var Afterline = line.replace(/\s+/g, " "); // trim multiple consecutive spaces down to only one space
                let index = Afterline.indexOf(":") // detect :
                //console.log(Afterline.slice(0, 2).toLowerCase)
                
                if (Afterline.slice(nameIndex, nameIndex+2) == "Bu") {
                    arr.bu.push(...Afterline.slice(index + 2, Afterline.length - 1).split(" "))
                } else {
                    arr.aş.push(...Afterline.slice(index + 2, Afterline.length - 1).split(" "))
                }
            }

        }

    } catch (e) {
        console.log(e)
    } finally {
        var buCounts = {};
        var aşCounts = {};
        arr.bu.forEach(function (x) { buCounts[x] = (buCounts[x] || 0) + 1; });
        arr.aş.forEach(function (x) { aşCounts[x] = (aşCounts[x] || 0) + 1; });

        let sortedBuCounts = Object.entries(buCounts).sort((a, b) => b[1] - a[1])
        let sortedAşCounts = Object.entries(aşCounts).sort((a, b) => b[1] - a[1])
        console.log(`Burak Deniz Kelimeleri: ${sortedBuCounts.slice(0, 20)}`);
        console.log(`Nur Beril Taçyıldız Kelimeleri: ${sortedAşCounts.slice(0, 20)}`);

    }
}

processLineByLine()

