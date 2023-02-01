const fs = require('fs');

setTimeout(() => {
    console.log('Time I finished')
}, 0)

setImmediate(() => {
    console.log('Imediate function called')
})

fs.readFile('input.txt', () => {
    console.log('File read')
})


console.log('Normall call');