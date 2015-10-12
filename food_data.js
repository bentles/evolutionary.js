/* Minimum  annual nutritional intake for average adult male:
Calories	1095
Protein	25550
Calcium	292
Iron	4380
Vitamin A	1825
Thiamine VB1	657
Riboflavin VB2	985.5
Niacin	6570
Ascorbic Acid VC	27375
*/
var fs = require('fs');
var m_intake = [1095, 25550, 292, 4380, 1825, 657, 985.5, 6570,27375]

var food = [];
var fileContents = fs.readFileSync('food.csv');
var lines = fileContents.toString().split('\r\n');

for (var i = 0; i < lines.length; i++) {
    food.push(lines[i].toString().split(';'));
}

module.exports.food = food;
module.exports.m_intake = m_intake;