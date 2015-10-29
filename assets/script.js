/* global $, CSV, Blob, saveAs */

var data = [
    { label: 'Data Type',
      id: 'data-type',
      required: true,
      type: 'dropdown',
      custom_options: true,
      options: ['mRNA'] },
    { label: 'Date',
      id: 'date',
      required: true,
      type: 'date' },
    { label: 'Raw File Format',
      id: 'raw-file-format',
      required: true,
      type: 'dropdown',
      options: ['FASTQ','FASTA','BAM'] },
    // ['Organism', 'organism', true, 'dropdown', 'eco', null, ['eco']],
    // ['Parent Strain', 'parent-strain', true, 'input', 'K-12 MG1655', 'K-12 MG1655'],
    // ['Strain ID', 'strain-id', true, 'input', 'BOP27', ''],
    // ['Mutations', 'mutations', true, 'input', 'deltaCRP', ''],
    // ['Antibody', 'antibody', false, 'input', 'anti-CRP', ''],
    // ['Growth Stage', 'growth-stage', true, 'input', 'mid-log (OD=0.5)', 'mid-log'],
    // ['Oxygen Availability', 'oxygen-availability', true, 'input', 'O2,NO3, SO4,etc', 'O2'],
    // ['Sample Preparation Details', 'sample-preparation-details', false, 'input', '', ''],
    // ['Base Media', 'base-media', true, 'input', 'M9', 'M9'],
    // ['Carbon Source(s)', 'carbon-source', true, 'multi-dropdown', 'Glucose', null, ['Glucose'],
    //  ['Carbon Source(s)', 'carbon-source-custom', false, 'input', '']],
    // ['Concentration for each carbon source (g/L)', 'concentration', true, 'input-number', '', ''],
    // ['Nitrogen Source', 'nitrogen-source', true, 'multi-dropdown', ['NO3'],
    //  ['Nitrogen Source', 'nitrogen-source-custom', false, 'input']],
    // ['Phosphorous Source', 'phosphorous-source', true, 'multi-dropdown', ['PO4'],
    //  ['Phosphorous Source', 'phosphorous-source-custom', false, 'input']],
    // ['Sulphur Source', 'sulphur-source', true, 'multi-dropdown', ['Sulphur'],
    //  ['Sulphur Source', 'sulphur-source-custom', false, 'input']],
    // ['Antibiotic Resistance', 'antibiotic-resistance', true, 'input', 'Kanamycin (50 ug/ml)', ''],
    // ['Replicates', 'replicates', false, 'input', '', ''],
    // ['Other Experimental Variables', 'other-experimental-variables', false, 'input', '', ''],
    // ['Sequencer', 'sequencer', false, 'multi-dropdown', ['Miseq'],
    //  ['Sequencer', 'sequencer-custom', false, 'input']],
    // ['Read Length', 'read-length', false, 'input', '50', ''],
    // ['Illumina Kit Details', 'illumina-kit-details', false, 'input', '50 cycle kit PE', '50 cycle kit PE'],
    // ['Experiment Summary and Hypothesis', 'experiment-summary', false, 'textarea', ''],
    // ['Experimentalist', 'experimentalist', false, 'input', '', 'Unknown'],
    // ['Experimentalist Email', 'experimentalist-email', false, 'input', '', 'Unknown'],
    // ['Grant ID', 'grant-id', false, 'input', '', ''],
    // ['Kit Used to Isolate DNA/RNA', 'isolate-kit', false, 'input', 'Qiagen', 'Unknown'],
    // ['SOP Title', 'sop-title', false, 'input', '', ''],
    // ['Alignment Algorithm and Options', 'alignment-algorithm', false, 'input', 'Bowtie2', 'Bowtie2'],
    // ['Reference Sequence', 'reference-sequence', false, 'input', 'NC_000913.3', 'Unknown'],
    // ['Other Processing Details', 'other-processing-details', false, 'input', '', ''],
    // ['GEO Submission', 'geo-submission', false, 'input', 'GDS5093', ''],
    { label: 'Creator (Name)',
      id: 'creator',
      required: true,
      type: 'input',
      example: 'Zachary King' },
    { label: 'Creator Email',
      id: 'creator-email',
      required: true,
      type: 'input',
      example: 'zakandrewking@gmail.com' },
    // ['State of Preculture', 'state-of-preculture', false, 'input', 'stationary phase overnight, exponential phase', ''],
    // ['Media of Preculture', 'media-of-preculture', false, 'input', 'LB,M9', ''],
    // ['Flasks Since Frozen Stock', 'flasks', false, 'input', '3', ''],
    // ['Time Point', 'time-point', false, 'input', '200s', '']
];

$(document).ready(function(){

    for(var i = 0; i < data.length; i++) {
        // add the input
        create_input(data[i], $('#center-column'), i === 0);
    }
    $("#submitForm").click(function(){
        var array = [];
        for(i = 0; i < data.length; i++){
            var val = get_value(data[i]['id']);
            if (val === null) {
                // alertIncomplete(data[i][1]);
                return;
            } else {
                array.push([data[i]['id'], val]);
            }
        }
        saveFile(array);
    });

});

function saveFile(array) {
    var csv = [],
        label = ['data-type', 'creator', 'date'].map(function(el) {
            return get_value(el).replace(/\//g, '-');
        }).join('_');
    console.log(label);
    csv.push(new CSV(array).encode());
    var file = new Blob(csv, {type: 'text/plain;charset=utf-8'});
    saveAs(file, label + '.csv');
}

function alertIncomplete(input){
    //alert( input + ' is required')
    var error_string = '';
    for(var z = 0; z < data.length; z++){
        if( get_value(data[z]) == 'Empty'){
            error_string += data[z][0] + ' is required\n';
        }


    }
    alert(error_string);
}

function get_value(id) {
    var value = $('#' + id).val();
    return value;
}

function add_div(html, label, required) {
    return '<div class="form-group"><label>' + label + required + '</label><br>' + html + '</div>';
}

function create_input(data, parent_sel, autofocus) {
    var label = data['label'],
        id = data['id'],
        required = data['required'] ? ' (required)' : '',
        type = data['type'],
        def = data['default'] || '',
        example = data['example'] || '',
        options = data['options'],
        html = '',
        autofocus_str = autofocus ? ' autofocus' : '',
        width = '200px',
        after_append, options_html, i;

    if (type == 'dropdown') {
        var select_options = {};
        if (data['multiple']) {
            select_options['multiple'] = true;
        }
        if (data['custom_options']) {
            select_options['tags'] = true;
            select_options['createTag'] = function(query) {
                return {
                    id: query.term,
                    text: query.term + ' (custom)',
                    tag: true
                };
            };
        }
        console.log(select_options);

        options_html = '';
        for(i = 0; i < options.length; i++){
            options_html += '<option value="'+ options[i] + '">' + options[i] + '</option>';
        }
        html = '<select id="' + id + '" style="width: ' + width + '" ' + autofocus_str + '>' + options_html + '</select>';
        after_append = function() {
            $('#' + id).select2(select_options);
        };
    } else if (type == 'date') {
        html = '<input type="text" class="form-control" id="' + id + '" value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: ' + width + '" >',
        after_append = function() {
            $('#' + id).datepicker({ format: 'yyyy-mm-dd' });
        };
    } else if (type == 'input') {
        html = '<input id="' + id + '" value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: ' + width + '" >';
    }

    // create and run
    parent_sel.append(add_div(html, label, required));
    if (after_append) after_append();
}
