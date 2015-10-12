var food_data = require('./food_data');
var create_ga = require('./ga_common');
var rand = require('randgen');

var weight_index = 10;
var name_index = 9;

var ga = create_ga(init_field, create_tourn_selector(0.95, 0.3, 2), fitness, 100, 77);
ga.run_for(50000);

function fitness(member) {
	var nutrition_failing_penalty = 0;
	
	var total_nutrition = [0,0,0,0,0,0,0,0,0];
	var total_cost = 0;	
	
	//calc cost and nutrition gained
	for (var i = 0 ; i < member.length; i++) {
		var current_food = food_data.food[i];
		var current_weight = current_food[weight_index];
		var scale = member[i]/current_weight;
		total_cost += scale;		
		
		for (var j = 0; j < food_data.m_intake.length; j++) {	
			total_nutrition[j] += scale * current_food[j];			
		}
	}
	
	//check nutrition criteria met
	for (var i = 0; i < food_data.m_intake.length; i++) {
		if (total_nutrition[i] < food_data.m_intake[i])
			nutrition_failing_penalty += 100;		
	}
	
	//negate fitness so more positive is better
	return -(total_cost + nutrition_failing_penalty);
}

function init_field(j) {
	return Math.random() * food_data.food[j][weight_index] * 1; 	
}

function create_tourn_selector(percent, mutate_chance, std_dev) {
	function tourn_select(fitnesses) {
		//tourn select
		var maxfit = -Number.MAX_VALUE;
		var maxfit_index = 0;
		var count = fitnesses.length * percent;
		
		for (var i = 0; i < count; i++) {
			var index = Math.floor(Math.random() * fitnesses.length);
			
			if (fitnesses[index] > maxfit) {
				maxfit = fitnesses[index];
				maxfit_index = index;				
			}			
		}
		
		return maxfit_index;		
	}
	
	function mutate(value, i) {
		var newval = 0;
		if (Math.random() < mutate_chance)
			newval = value + rand.rnorm(0, std_dev) * food_data.food[i][weight_index];
		else
			newval = value + rand.rnorm(0, 1);		
		
		return newval < 0 ? 0 : newval;
	}
	
	function crossover_mutate(parent0, parent1)
	{
		var children = [[],[]];
		for (var i = 0; i < parent1.length; i++) {
			if (Math.random() < 0.5) {								
				children[0].push(mutate(parent1[i], i));
				children[1].push(mutate(parent0[i], i));
			}
			else {
				children[0].push(mutate(parent0[i], i));
				children[1].push(mutate(parent1[i], i));				
			}			
		}
		
		return children;
	}
	
	return function(population, fitnesses) {
		var new_pop = [];
		
		while (new_pop.length < population.length) {
			//tourn select
			var parent1 = population[tourn_select(fitnesses)];
			var parent2 = population[tourn_select(fitnesses)];			
			
			//build new generation	
			var children = crossover_mutate(parent1, parent2);
			new_pop = new_pop.concat(children);		
		}
		
		return new_pop;
	}
}	