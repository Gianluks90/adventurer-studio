

const converter_dict = {
    'platino': 1000,
    'oro': 100,
    'electrum': 50,
    'argento': 10,  
    'rame': 1}


function converti(valore, da, a) {
    return valore * converter_dict[da] / converter_dict[a];
}

/**
 * 
 * @param {*} valori_dict  dict con valori di platino, oro, argento, rame del sacco
 * @returns  return_dict  dict con valori minimizzati di platino, oro, argento, rame del sacco
 */
function minimise_bag(valori_dict ) {  
    let return_dict = {};
    let min_bag = 0;
    for (let [k, v] of Object.entries(valori_dict)) {
        min_bag += converti(v, k, 'rame');
    }
    for (let entry of Object.entries(converter_dict)) {
        true_div = min_bag / entry[1];
        return_dict[entry[0]] = Math.floor(true_div);
        min_bag = min_bag % entry[1];
    }
    return return_dict ;
}

/** 
 *  @param {*} valori_dict  dict con valori di platino, oro, argento, rame del sacco
 * @param {*} valori_dict2  dict con valori di platino, oro, argento, rame da aggiungere o sottrarre
 * @param {*} what  stringa 'add' o 'subtract' per decidere se mettere o togliere
 * @returns  return_dict  dict con valori minimizzati di platino, oro, argento, rame del sacco
 */

function add_subtract(valori_dict, valori_dict2, what = 'add') { 
    let return_dict = {};
    let min_bag = 0;
    let min_bag2 = 0;
    let totale = 0;
    for (let [k, v] of Object.entries(valori_dict)) {
        min_bag += converti(v, k, 'rame');
    }
    for (let [k, v] of Object.entries(valori_dict2)) {
        min_bag2 += converti(v, k, 'rame');
    }
    if (what == 'add')
        totale = min_bag + min_bag2;
    else
        totale = min_bag - min_bag2;
    for (let entry of Object.entries(converter_dict)) {
        true_div = totale / entry[1];
        return_dict[entry[0]] = Math.floor(true_div);
        totale = totale % entry[1];
    }
    return return_dict ;
}


// example_dict = {
//     'platino': 1,
//     'oro': 1,
//     'argento': 1055,
//     'rame': 1
// }

// console.log(minimise_bag(example_dict))