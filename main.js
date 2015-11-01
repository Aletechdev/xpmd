/* global $, Blob, saveAs, CSV */

var data = [
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
    { label: 'Data Type',
      id: 'data-type',
      type: 'dropdown',
      custom: true,
      default: 'DNA-seq',
      options: ['DNA-seq', 'RNA-seq', 'ChIP-seq', 'ChIP-exo'] },
    { label: 'Date (YYYY-MM-DD)',
      id: 'date',
      required: true,
      type: 'date' },
    { label: 'Raw File Format',
      id: 'raw-file-format',
      type: 'dropdown',
      options: ['FASTQ','FASTA','BAM'],
      default: 'FASTQ' },
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
      id: 'parent-strain',
      required: true,
      example: 'BOP27' },
    { label: 'Strain ID',
      id: 'strain-id',
      required: true,
      example: 'BOP286' },
    { label: 'Electron acceptor',
      id: 'electron-acceptor',
      type: 'dropdown',
      options: ['O2', 'NO3', 'SO4'],
      default: null,
      required: true,
      multiple: true,
      custom: true },
    { label: 'Base Media',
      id: 'base-media',
      required: true,
      example: 'M9' },
    { label: 'Mutations',
      id: 'mutations',
      example: 'Δcrp' },
    { label: 'Antibody',
      id: 'antibody',
      example: 'anti-CRP' },
    { label: 'Growth Stage',
      id: 'growth-stage',
      example: 'mid-log' },
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
    // ['State of Preculture', 'state-of-preculture', false, 'input', 'stationary phase overnight, exponential phase', ''],
    // ['Media of Preculture', 'media-of-preculture', false, 'input', 'LB,M9', ''],
    // ['Flasks Since Frozen Stock', 'flasks', false, 'input', '3', ''],
    // ['Time Point', 'time-point', false, 'input', '200s', '']
    { label: 'Sample Preparation Details',
      id: 'sample-preparation-details',
      type: 'textarea' },
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
        if (!check_required()) return;

        var array = [];
        for(i = 0; i < data.length; i++){
            var val = get_value(data[i]['id']);
            array.push([data[i]['id'], val]);
        }
        save_file(array);
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
    check_required();
}

function save_file(array) {
    var label = ['data-type', 'creator', 'date'].map(function(el) {
        return get_value(el).replace(/\//g, '-');
    }).join('_'),
        csv = [new CSV(array).encode()],
        file = new Blob(csv, { type: 'text/plain;charset=utf-8' });
    saveAs(file, label + '.csv');
}

function get_value(id) {
    return $('#' + id).val();;
}

function set_value(id, value) {
    var sel = $('#' + id),
        split_val = value.split(',');
    if (sel.data('select2'))
        sel.select2('val', split_val); // TODO bug: cannot set custom tags
    else
        sel.val(value);

    updated_required_label(id, value);
}

function updated_required_label(id, value) {
    if (value === '') {
        $('#required-alert-' + id)
            .addClass('alert-danger')
            .removeClass('alert-success');
    } else {
        $('#required-alert-' + id)
            .addClass('alert-success')
            .removeClass('alert-danger');
    }
    check_required();
}

function add_form_container(html, label, required, id, custom, multiple) {
    var required_str, custom_mult_str;
    if (required)
        required_str = '<span id="required-alert-' + id + '" class="required alert alert-danger" role="alert">(Required)</span>';
    else
        required_str = '';

    if (custom && multiple)
        custom_mult_str = ' (Choose one or more, including custom values)';
    else if (custom)
        custom_mult_str = ' (Choose or enter a new value)';
    else if (multiple)
        custom_mult_str = ' (Choose one or more)';
    else
        custom_mult_str = '';

    return '<div class="form-group row"><div class="col-sm-6"><label>' + label + '</label>' + custom_mult_str +
        required_str +
        '</div><div class="col-sm-6">' + html + '</div></div>';
}

function add_dropdown_options(input_sel, options, options_data, def, select_options) {
    var options_html = '';
    for (var i = 0; i < options.length; i++) {
        var opt = options[i],
            selected_str = opt === def ? ' selected="selected"' : '';
        options_html += '<option value="'+ opt + '"' + selected_str + '>' + opt + '</option>';
    }

    input_sel.html(options_html);
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

    // initialize select2
    input_sel.select2(select_options);

    // to avoid the default tag
    if (!def) input_sel.select2('val', []);
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
        multiple = data['multiple'],
        custom = data['custom'],
        html = '',
        autofocus_str = autofocus ? ' autofocus' : '',
        after_append;

    // check for some required attributes
    if (!id) console.error('No ID for ' + label);

    if (type == 'dropdown') {
        var select_options = {};
        // multiple selections
        if (multiple) {
            select_options['multiple'] = true;
        }
        // custom options
        if (custom) {
            select_options['tags'] = true;
            select_options['createTag'] = function(query) {
                return {
                    id: query.term,
                    text: query.term + ' (custom)',
                    tag: true
                };
            };
        }
        html = '<select id="' + id + '" style="width: 100%" ' + autofocus_str + '></select>';

        after_append = function() {
            // prefer options to options_function
            if (!options && options_function) {
                options_function(function(options, options_data) {
                    add_dropdown_options($('#' + id), options, options_data, def, select_options);
                });
            } else {
                add_dropdown_options($('#' + id), options, null, def, select_options);
            }
        };
    } else if (type == 'date') {
        html = '<input type="text" class="form-control" id="' + id + '" value="' + def + '"' +
            ' placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >',
        after_append = function() {
            $('#' + id).datepicker({ format: 'yyyy-mm-dd' });
        };
    } else if (type == 'textarea') {
        html = '<textarea id="' + id + '" class="form-control" " value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" ></textarea>';
    } else {
        html = '<input id="' + id + '" class="form-control" " value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >';
    }

    // create and run
    parent_sel.append(add_form_container(html, label, required, id, custom, multiple));
    // toggle the required label
    $('#' + id).on('change', function() {
        updated_required_label(id, this.value);
    });
    if (after_append) after_append();
}
