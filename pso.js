//public service o-nouncement
var add = require('vectors/add')(77);
var copy = require('vectors/copy')(77);
var food = require('./food_data');

var pso = create_pso(10000, 77, food.init_field, function(){return 0;}, food.fitness, 0.9, 0.1);
pso.run_for(10000);

function create_pso(nr_particles, nr_fields, init_field, init_velocity, fitness_func, c1, c2) {
    
    var num_particles = nr_particles;
    var positions = [];
    var best_positions = [];
    var velocities = [];
    
    for(var i = 0; i < nr_particles; i++) {
        var pos = [];
        var vel = [];
        for(var j = 0; j < nr_fields; j++) {
            pos[j] = init_field(j);
            vel[j] = init_velocity();
        }
        positions[i] = copy(pos);
        best_positions[i] = copy(pos);
        velocities[i] = vel;
    }

    var global_best = [];

    for(var i = 0; i < nr_particles; i++) {
        var fit = fitness_func(positions[i]);

        if (fit > fitness_func(global_best)) {
            global_best = positions[i];
        }
    }

    function run_for(times) {
        for(var i = 0; i < times; i++) {
            
            for(var j = 0; j < positions.length; j++) {
                var fitness = fitness_func(positions[j]);
                
                if (fitness > fitness_func(best_positions[j])) {
                    best_positions[j] = copy(positions[j]);
                }

                if (fitness > fitness_func(global_best)) {
                    global_best = copy(positions[j]);
                    console.log("New best fitness: " + -fitness);
                    //console.log(positions[j]);
                }                
            }

            //update pos and velocity
            for(var j = 0; j < positions.length; j++) {
                for(var k = 0; k < nr_fields; k++) {
                    velocities[j][k] =
                        velocities[j][k] +
                        c1*Math.random()*(best_positions[j][k] - positions[j][k]) +
                        c2*Math.random()*(global_best[k] - positions[j][k]);
                }
                
                //update pos                
                add(positions[j], velocities[j]);
                for(var k = 0; k < nr_fields; k++) {
                    if (positions[j][k] < 0)
                        positions[j][k] = 0;
                }
            }
        }
    };

    return {run_for : run_for};
}
