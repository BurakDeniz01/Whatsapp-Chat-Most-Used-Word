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
            if (line.slice(17, 20) == " - " && line.slice(20, 28) != "Messages" && line.indexOf("<Media") == -1) {
                var nameIndex = line.indexOf(" - ")
                var Afterline = line.replace(/\s+/g, " "); // trim multiple consecutive spaces down to only one space
                let index = Afterline.indexOf(": ") // detect :
                if (obj[`${Afterline.slice(nameIndex + 3, nameIndex + 5)}`] === undefined) {
                    obj[`${Afterline.slice(nameIndex + 3, nameIndex + 5)}`] = []
                }
                obj[`${Afterline.slice(nameIndex + 3, nameIndex + 5)}`].push(...Afterline.slice(index + 2, Afterline.length - 1).toLowerCase().split(" "))
            }
        }
    } catch (e) {
        console.log(e)
    } finally {
        try {
            var countWords = {}
            var countValue = {}
            for (const [key, value] of Object.entries(obj)) {
                countValue = {}
                obj[key].forEach(function (x) { countValue[x] = (countValue[x] || 0) + 1; });
                // Object.entries(countValue).sort((a, b) => b[1] - a[1]) //sort by frequency
                console.log(`Most used 20 word of ${key}: ${Object.entries(countValue).sort((a, b) => b[1] - a[1]).slice(0, 20)}`);
            }
        } catch (e) {
            console.log(e)
        }
    }
}
processLineByLine()