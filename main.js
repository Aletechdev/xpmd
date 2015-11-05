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
      options: ['DNA-seq', 'RNA-seq', 'ChIP-seq', 'ChIP-exo', 'Ribo-seq'] },
    { label: 'MiSeq Run Date (YYYY-MM-DD)',
      id: 'run-date',
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
          $.getJSON('kegg_organisms.json', function(d) {
              callback(Object.keys(d), d);
          });
      } },
    { label: 'Parent strain',
      id: 'parent-strain',
      required: true,
      custom: true,
      type: 'dropdown',
      options: ['BOP27', 'BW25113 (Keio)'] },
    { label: 'Strain ID',
      id: 'strain-id',
      required: true,
      example: 'BOP286' },
    { label: 'Mutations',
      id: 'mutations',
      example: 'Δcrp' },
    { label: 'Growth Stage',
      id: 'growth-stage',
      example: 'mid-log' },
    { label: 'Antibody',
      id: 'antibody',
      example: 'anti-CRP' },
    { label: 'Base Media',
      id: 'base-media',
      type: 'dropdown',
      required: true,
      custom: true,
      options: ['M9', 'LB'] },
    { label: 'Carbon Source(s)',
      id: 'carbon-source',
      type: 'dropdown',
      multiple: true,
      custom: true,
      options: ['Glucose', 'Fructose', 'Acetate', 'Galactose'] },
    { label: 'Nitrogen Source(s)',
      id: 'nitrogen-source',
      type: 'dropdown',
      multiple: true,
      custom: true,
      options: ['NO3', 'Glutamine', 'Glutamate'] },
    { label: 'Phosphorous Source(s)',
      id: 'phosphorous-source',
      type: 'dropdown',
      multiple: true,
      custom: true,
      options: ['PO4'] },
    { label: 'Sulfur Source(s)',
      id: 'Sulfur-source',
      type: 'dropdown',
      multiple: true,
      custom: true,
      options: ['Ammonium sulfate'] },
    { label: 'Electron acceptor',
      id: 'electron-acceptor',
      type: 'dropdown',
      options: ['O2', 'NO3', 'SO4'],
      multiple: true,
      custom: true },
    { label: 'Antibiotic resistance',
      id: 'antibiotic-resistance',
      type: 'dropdown',
      custom: true,
      multiple: true,
      options: ['Kanamycin', 'Spectinomycin', 'Streptomycin', 'Ampicillin',
                'Carbenicillin', 'Bleomycin', 'Erythromycin', 'Polymyxin B',
                'Tetracycline', 'Chloramphenicol'] },
    { label: 'Biological replicates',
      id: 'biological-replicates',
      type: 'number',
      default: 1,
      min: 1,
      max: 100 },
    { label: 'Technical replicates',
      id: 'technical-replicates',
      type: 'number',
      default: 1,
      min: 1,
      max: 100 },
    { label: 'Sequencer',
      id: 'sequencer',
      type: 'dropdown',
      custom: true,
      default: 'MiSeq',
      options: ['MiSeq'] },
    { label: 'Illumina Kit Details',
      id: 'illumina-kit-details',
      type: 'dropdown',
      custom: true,
      default: '50 cycle kit PE',
      options: ['50 cycle kit PE'] },
    { label: 'Read Length',
      id: 'read-length',
      type: 'number',
      default: 50,
      min: 1,
      max: 1000000 },
    { label: 'Sample Preparation and Experiment Details',
      id: 'expertiment-details',
      type: 'textarea' }
];
// ['Concentration for each carbon source (g/L)', 'concentration', true, 'input-number', '', ''],
// ['Replicates', 'replicates', false, 'input', '', ''],
// ['Other Experimental Variables', 'other-experimental-variables', false, 'input', '', ''],
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
    var label = ['data-type', 'creator', 'run-date'].map(function(el) {
        return get_value(el).replace(/\//g, '-');
    }).join('_'),
        csv = [new CSV(array).encode()],
        file = new Blob(csv, { type: 'text/plain;charset=utf-8' });
    saveAs(file, label + '.csv');
}

function get_value(id) {
    var val = $('#' + id).val();;
    if ((typeof val === 'undefined') || (val === null))
        val = '';
    return val;
}

function set_value(id, value) {
    var sel = $('#' + id),
        split_val = value.split(',').filter(function(x) {
            return x.replace(' ', '') !== '';
        });
    if (sel.data('select2')) {
        // for multiple selections, add the options if it doesn't exist
        var ids = [];
        sel.find('option').each(function() {
            ids.push($(this).val());
        });
        split_val.forEach(function(val) {
            if (ids.indexOf(val) === -1)
                sel.append('<option value="' + val + '">' + val + '</option>');
        });
    }
    sel.val(split_val).trigger('change');

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
    if (!def) input_sel.val([]).trigger('change');
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
        min = data['min'],
        html = '',
        autofocus_str = autofocus ? ' autofocus' : '',
        after_append;

    // check for some required attributes
    if (!id) console.error('No ID for ' + label);
    if (options && (type !== 'dropdown'))
        console.error('Has "options" with a type that is not "dropdown" for ' + label);
    if (min && (type !== 'number'))
        console.error('Has "min" with a type that is not "number" for ' + label);

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
    } else if (type === 'date') {
        html = '<input type="text" class="form-control" id="' + id + '" value="' + def + '"' +
            ' placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >',
        after_append = function() {
            $('#' + id).datepicker({ format: 'yyyy-mm-dd' });
        };
    } else if (type === 'textarea') {
        html = '<textarea id="' + id + '" class="form-control" value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" ></textarea>';
    } else if (type === 'number' ){
        html = '<input id="' + id + '" type="number" class="form-control" min="' + min + '"' +
                 ' value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >';
        after_append = function() {
            $('#' + id).bootstrapNumber();
        };
    } else {
        html = '<input id="' + id + '" class="form-control" value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >';
    }

    // create and run
    parent_sel.append(add_form_container(html, label, required, id, custom, multiple));
    // toggle the required label
    $('#' + id).on('change', function() {
        updated_required_label(id, this.value);
    });
    if (after_append) after_append();
}
