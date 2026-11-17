const pdf = require('pdf-parse');
const fs = require('fs');

const dataBuffer = fs.readFileSync('EcoRuta.docx.pdf');
pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(function(err) {
    console.error(err);
});
