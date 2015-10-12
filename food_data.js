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
var m_intake = [1095, 25550, 292, 4380, 1825, 657, 985.5, 6570,27375];

var food = [];
var weight_index = 10;
var name_index = 9;
var fileContents = fs.readFileSync('food.csv');
var lines = fileContents.toString().split('\n');

for (var i = 0; i < lines.length; i++) {
    food.push(lines[i].toString().split(';'));
}

function fitness(member) {
	var nutrition_failing_penalty = 0;
	
	var total_nutrition = [0,0,0,0,0,0,0,0,0];
	var total_cost = 0;	
	
	//calc cost and nutrition gained
	for (var i = 0 ; i < member.length; i++) {
		var current_food = food[i];
		var current_weight = current_food[weight_index];
		var scale = member[i]/current_weight;
		total_cost += scale;		
		
		for (var j = 0; j < m_intake.length; j++) {	
			total_nutrition[j] += scale * current_food[j];			
		}
	}
	
	//check nutrition criteria met
	for (var i = 0; i < m_intake.length; i++) {
		if (total_nutrition[i] < m_intake[i])
            //nyeh
			nutrition_failing_penalty += 100;/* 10 * (m_intake[i] - total_nutrition[i] );		*/
	}
	
	//negate fitness so more positive is better
	return -(total_cost + nutrition_failing_penalty);
}

function init_field(j) {
	return Math.random() * food[j][weight_index] * 20; 	
}

module.exports.food = food;
module.exports.m_intake = m_intake;
module.exports.fitness = fitness ;
module.exports.init_field = init_field ;
module.exports.weight_index = weight_index ;
module.exports.name_index = name_index ;
