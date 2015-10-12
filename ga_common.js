function create_ga(init_field, select_mutate_func, fit_func, pop_size, chrom_size)
{
	//make population
	var population = [];
	var fitnesses = [];
	var maxfit = -Number.MAX_VALUE;
    var best_chromo = [];
	
	
	for (var i = 0 ; i < pop_size; i++)	{
		var member = [];
		for (var j = 0; j < chrom_size; j++) {
			 member[j] = init_field(j);			
		}
		population[i] = member;
	}
	
	function run_for(generations)
	{
		for (var gen = 0; gen < generations; gen++) {		
			var currmaxfit = -Number.MAX_VALUE;
			//get all fitnesses and save max
			for (var i = 0; i < pop_size; i++) {
				fitnesses[i] = fit_func(population[i]);	
				
				if(fitnesses[i] > currmaxfit)
					currmaxfit = fitnesses[i];
				
				if (fitnesses[i] > maxfit)
				{
                    best_chromo = population[i];
					maxfit = fitnesses[i];
					console.log("New best (: " + -maxfit);
				}
			}
			
			//select and mutate pop members based on fitnesses
			var new_pop = select_mutate_func(population, fitnesses);
			
			//replace old gen with new gen
			population = new_pop;
			
			if ((gen % 500) === 0) {
				console.log("Generation " + gen + ": " + -maxfit + "," + -currmaxfit);				
			}
		}
	}
	
	return {run_for: run_for};
}

module.exports = create_ga ;
