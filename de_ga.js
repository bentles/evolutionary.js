var food_data = require('./food_data');
var create_ga = require('./ga_common');
var sub = require('vectors/sub')(77);
var add = require('vectors/add')(77);
var mult = require('vectors/mult')(77);
var copy = require('vectors/copy')(77);

var ga = create_ga(food_data.init_field, create_de_ga(0.8) , food_data.fitness, 100, 77);
ga.run_for(20000);

function create_de_ga(scale_factor) {

    function random_not_i(i, length) {
        while (true) {
            var index = Math.floor(Math.random() * length);
            if (index != i)
                return index;
        }
    }

    function get_3_distinct_indexes(length, i) {
        var indexes = [random_not_i(i, length)] ;

        var found = false;
        while(!found) {
            indexes[1] = random_not_i(i, length) ;
            if (indexes[1] !== indexes[0])
                found = true;
        }

        found = false;
        while(!found) {
            indexes[2] = random_not_i(i, length) ;
            if (indexes[2] !== indexes[0] && indexes[2] !== indexes[1])
                found = true;
        }

        return indexes ;

    }

    return function(population, fitness) {
        var newpop = [];
        
        for (var i = 0; i < population.length; i++) {
            //get indexes of 3 members distinct from each other and 'i'
            var indexes = get_3_distinct_indexes(population.length, i);
            //for the sake of clarity - copy because arrays modified otherwise (reference type)
            var x1 = copy(population[indexes[0]]);
            var x2 = copy(population[indexes[1]]);
            var x3 = copy(population[indexes[2]]);
            
            newpop[i] = add(x3, mult(sub(x1, x2), scale_factor)); //lookin lispy
            for(var j = 0; j < newpop[i].length; j++) {
                if (newpop[i][j] < 0)
                    newpop[i][j] = 0; //ensure non-negative food amounts
            }
            
        }

        for(var i = 0; i < population.length; i++) {
            for(var j = 0; j < 77; j++) {
                //coin toss (toin coss) crossover with parent
                if (Math.random() < 0.5)
                    newpop[i][j] = population[i][j];
            }

            var fit = food_data.fitness(newpop[i]);
            
            if (fit > fitness[i])
                population[i] = newpop[i];
        }

        return population;
    };
}
