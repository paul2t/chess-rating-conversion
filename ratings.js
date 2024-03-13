
const ratings_conversions = new Map([
    ["chesscom-rapid", [ 0.7513439745, 461.6457348 ] ],
    ["lichess-rapid", [ 0.6298191743, 948.7785739 ] ],
    ["chesscom-blitz", [ 1.0, 0.0 ] ],
    ["lichess-blitz", [ 0.7658478335, 616.0098942 ] ],
    ["chesscom-bullet", [ 1.036516455, -112.4543786 ] ],
    ["lichess-bullet", [ 0.8660009037, 373.1784651 ] ],
    ["lichess-classical", [ 0.5264331886, 1070.387055 ] ],
    ["uscf", [ 0.8717580938, 172.2566092 ] ],
    ["fide", [ 0.8056176471, 284.9338235 ] ],
]);


document.getElementById("input-rating").addEventListener("change", (event) => on_ratings_params_changed());
document.getElementById("input-rating-type").addEventListener("change", (event) => on_ratings_params_changed());
init_from_url_parameter();
var target;


function update_target_lines() {
    if (target != null) {
        const rating_lines = document.getElementsByClassName("rating-line");

        let found = false;
        for (let line of rating_lines) {
            if (line.classList.contains(target)) {
                found = true;
                line.style.display = '';
            } else {
                line.style.display = 'none';
            }
        }
        if (!found) {
            for (let line of rating_lines) {
                line.style.display = '';
            }
        }
    }
}

function init_from_url_parameter() {
    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);
    const rating = url_params.get('rating');
    const type = url_params.get('from');
    target = url_params.get('to');
    
    if (rating != null)
        document.getElementById("input-rating").value = rating;
    if (type != null)
        document.getElementById("input-rating-type").value = type;

    update_target_lines();
    update_ratings();
}

function update_input_color() {
    const input_rating_value_element = document.getElementById("input-rating");
    const input_rating_type_element = document.getElementById("input-rating-type");

    const classes = input_rating_type_element.options[input_rating_type_element.selectedIndex].classList;
    input_rating_type_element.classList = [...classes];
    input_rating_value_element.classList = [...classes];
}

function on_ratings_params_changed() {
    const input_rating_value = document.getElementById("input-rating").value;
    const input_rating_type = document.getElementById("input-rating-type").value;

    let params = new URLSearchParams();
    if (input_rating_value != "")
        params.set('rating', input_rating_value)
    params.set('from', input_rating_type);
    if (target != null)
        params.set('to', target);
    const new_url = `${location.pathname}?${params}`;
    history.replaceState(null, '', new_url);

    update_ratings_with(input_rating_value, input_rating_type);
    update_input_color();
}

function update_ratings() {
    const input_rating_value = document.getElementById("input-rating").value;
    const input_rating_type = document.getElementById("input-rating-type").value;
    update_ratings_with(input_rating_value, input_rating_type);
    update_input_color();
}

function update_ratings_with(input_rating_value, input_rating_type) {
    const ratings_outputs = document.getElementsByClassName("rating-result");

    const normalized_rating = rating_to_normalized_rating(input_rating_value, input_rating_type);

    for (let output of ratings_outputs) {
        const output_type = output.id;
        let rating = rating_from_normalized_rating(normalized_rating, output_type);
        output.textContent = rating;
    }
}

function rating_to_normalized_rating(input_rating_value, input_rating_type) {
    if (input_rating_value === "") return "";
    if (input_rating_type === "") return "";

    const conversion = ratings_conversions.get(input_rating_type);
    const result = (input_rating_value - conversion[1]) / conversion[0];

    return result;
}

function rating_from_normalized_rating(input_rating_value, output_rating_type) {
    if (input_rating_value === "") return "";
    if (output_rating_type === "") return "";

    const conversion = ratings_conversions.get(output_rating_type);
    const result = conversion[0] * input_rating_value + conversion[1];

    return Math.round(result/10)*10; // Rounded to nearest 10s.
}
