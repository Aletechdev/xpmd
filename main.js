/* global $, Blob, saveAs, CSV */

var data = [
    { label: 'Data Type',
      id: 'data-type',
      type: 'dropdown',
      custom_options: true,
      options: ['DNA-seq', 'RNA-seq', 'ChIP-seq', 'ChIP-exo'] },
    { label: 'Date',
      id: 'date',
      required: true,
      type: 'date' },
    { label: 'Raw File Format',
      id: 'raw-file-format',
      type: 'dropdown',
      options: ['FASTQ','FASTA','BAM'] },
    { label: 'Organism',
      id: 'organism',
      type: 'dropdown',
      default: 'eco',
      options_function: function(callback) {
          var options = [];
          $.getJSON('assets/kegg_organisms.json', function(d) {
              callback(Object.keys(d), d);
          });
      } },
    { label: 'Parent strain',
      required: true,
      example: 'BOP27' },
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

    // add the uploader
    create_uploader();

    // add the form
    for(var i = 0; i < data.length; i++) {
        // add the input
        create_input(data[i], $('#center-column'), i === 0);
    }

    $('#submit').click(function(){
        if (!check_required()) {
            return;
        }
        var array = [];
        for(i = 0; i < data.length; i++){
            var val = get_value(data[i]['id']);
            array.push([data[i]['id'], val]);
        }
        saveFile(array);
    });

});

function check_required() {
    if ($('.required.alert-danger').length !== 0) {
        $('#submit').get(0).disabled = true;
        $('#required-to-submit').show();
        return false;
    } else {
        $('#submit').get(0).disabled = false;
        $('#required-to-submit').hide();
        return true;
    }
}

function create_uploader() {
    $('#file-upload').fileReaderJS({
        dragClass: 'drag',
        readAsDefault: 'Text',
        on: {
            load: handle_upload
        }
    });
}

function handle_upload(e, file) {
    var csv_data = e.target.result,
        arrays = new CSV(csv_data).parse();
    for (var i = 0; i < arrays.length; i++)
        set_value(arrays[i][0], arrays[i][1]);
}

function saveFile(array) {
    var label = ['data-type', 'creator', 'date'].map(function(el) {
        return get_value(el).replace(/\//g, '-');
    }).join('_'),
        csv = [new CSV(array).encode()],
        file = new Blob(csv, { type: 'text/plain;charset=utf-8' });
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
    return $('#' + id).val();;
}

function set_value(id, value) {
    $('#' + id).val(value);
}

function add_div(html, label, required, id) {
    var required_str;
    if (required)
        required_str = '<span id="required-alert-' + id + '" class="required alert alert-danger" role="alert">(Required)</span>';
    else
        required_str = '';
    return '<div class="form-group row"><div class="col-sm-6"><label>' + label + '</label>' +
        required_str +
        '</div><div class="col-sm-6">' + html + '</div></div>';
}

function create_input(data, parent_sel, autofocus) {
    var label = data['label'],
        id = data['id'],
        required = data['required'],
        type = data['type'],
        def = data['default'] || '',
        example = data['example'] || '',
        options = data['options'],
        options_function = data['options_function'],
        html = '',
        autofocus_str = autofocus ? ' autofocus' : '',
        after_append, options_html, i;

    // prefer options to options_function
    if (!options && options_function) {
        options_function(next);
    } else {
        next(options, null);
    }

    function next(options, options_data) {
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
            if (options_data) {
                select_options['templateResult'] = function(state) {
                    return state.id + ': ' + options_data[state.id];
                };
                select_options['matcher'] = function (params, data) {
                    // check both the 3-letter-id and the explanation text
                    if ($.trim(params.term) === '' ||
                        data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1 ||
                        options_data[data.text].toLowerCase().indexOf(params.term.toLowerCase()) > -1) {
                        return data;
                    }
                    return null;
                };
            }

            options_html = '';
            for(i = 0; i < options.length; i++){
                var opt = options[i],
                    selected_str = opt === def ? ' selected="selected"' : '';
                options_html += '<option value="'+ opt + '"' + selected_str + '>' + opt + '</option>';
            }
            html = '<select id="' + id + '" style="width: 100%" ' + autofocus_str + '>' + options_html + '</select>';
            after_append = function() {
                $('#' + id).select2(select_options);
            };
        } else if (type == 'date') {
            html = '<input type="text" class="form-control" id="' + id + '" value="' + def + '"' +
                ' placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >',
            after_append = function() {
                $('#' + id).datepicker({ format: 'yyyy-mm-dd' });
            };
        } else {
            html = '<input id="' + id + '" class="form-control" " value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >';
        }

        // create and run
        parent_sel.append(add_div(html, label, required, id));
        // toggle the required label
        $('#' + id).on('change', function() {
            if (this.value === '') {
                $('#required-alert-' + id)
                    .addClass('alert-danger')
                    .removeClass('alert-success');
            } else {
                $('#required-alert-' + id)
                    .addClass('alert-success')
                    .removeClass('alert-danger');
            }
            check_required();
        });
        if (after_append) after_append();
    }
}
