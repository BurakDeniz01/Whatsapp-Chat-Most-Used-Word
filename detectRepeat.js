var fs = require('fs');
const readline = require('readline');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var obj = {};
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
            if (line.slice(17,20) == " - " && line.slice(20,28)!="Messages") {
                var nameIndex = line.indexOf(" - ")
                var Afterline = line.replace(/\s+/g, " "); // trim multiple consecutive spaces down to only one space
                let index = Afterline.indexOf(": ") // detect :
                if (obj[`${Afterline.slice(nameIndex+3, nameIndex + 5)}`] === undefined) {
                    obj[`${Afterline.slice(nameIndex+3, nameIndex + 5)}`] = []
                }
                obj[`${Afterline.slice(nameIndex+3, nameIndex + 5)}`].push(...Afterline.slice(index + 2, Afterline.length - 1).split(" "))
            }
        }
        for (const [key, value] of Object.entries(obj)) {
            if(key=="tp"){
                console.log(value)
            }
            console.log(`${key}`);
        }
    } catch (e) {
        console.log(e)
    } finally {
        try {
            var CountWords = {}
            for (const [key, value] of Object.entries(obj)) {
                //console.log(`${key}`)
                value.forEach(function (x) { CountWords[`${key}`][x] = (CountWords[`${key}`][x] || 0) + 1; });
                Object.entries(CountWords[`${key}`]).sort((a, b) => b[1] - a[1]) //sort by frequency
                console.log(`Most used 20 word of ${key}: ${Object.entries(CountWords[`${key}`]).sort((a, b) => b[1] - a[1]).slice(0, 20)}`);

                console.log(`${key}`);
            }
        } catch (e) {
            console.log(e)
        }

        // var buCounts = {};
        // var aşCounts = {};
        // obj.bu.forEach(function (x) { buCounts[x] = (buCounts[x] || 0) + 1; });
        // obj.aş.forEach(function (x) { aşCounts[x] = (aşCounts[x] || 0) + 1; });

        // let sortedBuCounts = Object.entries(buCounts).sort((a, b) => b[1] - a[1])
        // let sortedAşCounts = Object.entries(aşCounts).sort((a, b) => b[1] - a[1])
        // console.log(`Most used 20 word of first person: ${sortedBuCounts.slice(0, 20)}`);
        // console.log(`Most used 20 word of second person: ${sortedAşCounts.slice(0, 20)}`);

    }
}

processLineByLine()

