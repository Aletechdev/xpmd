/* -*- Mode: js2; indent-tabs-mode: nil; js2-basic-offset: 2; -*- */

/* global $, Blob, saveAs, CSV, d3, _ */

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
  { label: 'Project Name',
    id: 'project',
    required: true,
    type: 'input' },
  { label: 'Data Type',
    id: 'data-type',
    type: 'dropdown',
    custom: true,
    default: 'DNA-seq',
    options: ['DNA-seq', 'RNA-seq', 'ChIP-seq', 'ChIP-exo', 'Ribo-seq'] },
  { label: 'Experiment Date (YYYY-MM-DD)',
    id: 'run-date',
    required: true,
    type: 'date',
    description: 'For sequencing experiments, use the date the sample was run.'},
  { label: 'NCBI Taxonomy ID for Strain',
    id: 'taxonomy-id',
    type: 'dropdown',
    custom: true,
    required: true,
    options_function: function(callback) {
      $.getJSON('ncbi_taxon_ids.json')
        .success(function(d) { callback(Object.keys(d), d) })
        .fail(function(e) { console.log(e) })
    } },
  { label: 'Strain description',
    id: 'strain-description',
    description: ('Provide provide a full description of the strain. ' +
                  'Guidelines for describing mutations can be found ' +
                  '<a href="http://www.hgvs.org/mutnomen/recs.html" target="_blank" tabindex="-1">here</a>.'),
    required: true,
    example: 'e.g. Keio-crp, 76A>T, D111E, ΔF508, BOP8900(ΔadhE)' },
  { label: 'Growth Stage',
    id: 'growth-stage',
    example: 'mid-log' },
  { label: 'Antibody',
    id: 'antibody',
    example: 'anti-CRP' },
  { label: 'Environment',
    description: 'Describe any other environmental parameters, such as temperature.',
    id: 'environment',
    example: '42C' },
  { label: 'Base Media',
    id: 'base-media',
    type: 'dropdown',
    required: true,
    custom: true,
    options: ['M9', 'LB'] },
  { label: 'Isolate  Type',
    id: 'isolate-type',
    type: 'dropdown',
    custom: true,
    options: ['clonal', 'population'] },
  { label: 'Carbon Source(s)',
    id: 'carbon-source',
    type: 'dropdown',
    multiple: true,
    custom: true,
    concentration_with_default: '2',
    options: ['Glucose', 'Fructose', 'Acetate', 'Galactose'] },
  { label: 'Nitrogen Source(s)',
    id: 'nitrogen-source',
    type: 'dropdown',
    multiple: true,
    custom: true,
    concentration_with_default: 1,
    options: ['NH4Cl', 'Glutamine', 'Glutamate'] },
  { label: 'Phosphorous Source(s)',
    id: 'phosphorous-source',
    type: 'dropdown',
    multiple: true,
    custom: true,
    concentration_with_default: 3,
    options: ['KH2PO4'] },
  { label: 'Sulfur Source(s)',
    id: 'Sulfur-source',
    type: 'dropdown',
    multiple: true,
    custom: true,
    concentration_with_default: 0.24,
    options: ['MgSO4'] },
  { label: 'Electron acceptor(s)',
    id: 'electron-acceptor',
    type: 'dropdown',
    options: ['O2', 'NO3', 'SO4'],
    concentration_with_default: 0,
    multiple: true,
    custom: true },
  { label: 'Other supplement(s)',
    id: 'supplement',
    type: 'dropdown',
    options: [],
    concentration_with_default: 1,
    multiple: true,
    custom: true },
  { label: 'Antibiotic(s) added',
    id: 'antibiotic',
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
  { label: 'Machine',
    id: 'machine',
    type: 'dropdown',
    custom: true,
    options: ['MiSeq', 'NextSeq', 'HiSeq'] },
  { label: 'Illumina Kit',
    id: 'illumina-kit',
    type: 'dropdown',
    custom: true,
    options: ['50 Cycle', '150 Cycle', '300 Cycle', '500 Cycle', '600 Cycle'] },
  { label: 'Single- or paired-end reads',
    id: 'read-type',
    type: 'dropdown',
    options: ['Single-end reads', 'Paired-end reads'] },
  { label: 'Read Length',
    id: 'read-length',
    type: 'dropdown',
    options: ['31', '62', '76', '151', '301'],
    custom: true },
  { label: 'Sample Preparation and Experiment Details',
    id: 'expertiment-details',
    type: 'textarea' }
]

var data_as_object = {}
data.forEach(function(d) { data_as_object[d.id] = d })


$(document).ready(function(){

  // add the uploader
  create_uploader()

  // add the form
  for(var i = 0; i < data.length; i++) {
    // add the input
    create_input(data[i], $('#center-column'), i === 0)
  }

  // submit
  $('#submit').click(function(){
    if (!check_required()) return

    var array = []
    for(i = 0; i < data.length; i++){
      var val = get_value(data[i]['id'])
      array.push([data[i]['id'], val])
    }
    save_file(array)
  })

})

function check_required() {
  if ($('.required.alert-danger').length !== 0) {
    $('#submit').get(0).disabled = true
    $('#required-to-submit').show()
    return false
  } else {
    $('#submit').get(0).disabled = false
    $('#required-to-submit').hide()
    return true
  }
}

function create_uploader() {
  $('#file-upload').fileReaderJS({
    dragClass: 'drag',
    readAsDefault: 'Text',
    on: {
      load: handle_upload
    }
  })
}

function handle_upload(e, file) {
  var csv_data = e.target.result,
      arrays = new CSV(csv_data).parse()
  for (var i = 0; i < arrays.length; i++)
    set_value(arrays[i][0], arrays[i][1])
  check_required()
}


function folder_name() {
  var l = ['run-date', 'data-type'].map(function(el) {
    return get_value(el).replace(' ', '').replace(/\//g, '-')
  })
  return _.every(l) ? l.join('_') : ''
}


function update_folder_name() {
  $('#folder-name').val(folder_name())
}


function save_file(array) {
  var label = folder_name(),
      csv = [new CSV(array).encode()],
      file = new Blob(csv, { type: 'text/plain;charset=utf-8' })
  saveAs(file, label + '.csv')
}


function get_value(id, input_only) {
  /** Get the value for the given input id */

  if (_.isUndefined(input_only))
    input_only = false

  // try to get concentrations
  var concentrations = {}
  $('#' + id).parent().find('.concentration-input>input').each(function() {
    var el = $(this),
        val = $(this).val()
    if (val) concentrations[el.attr('id')] = val
  })

  // get the value
  var vals = $('#' + id).val()
  if ((typeof vals === 'undefined') || (vals === null))
    return ''

  if (input_only)
    return vals

  // add concentrations to val
  if (_.isArray(vals)) {
    return vals.map(function(val) {
      if (val in concentrations)
        return val + '(' + concentrations[val] + ')'
      else
        return val
    })
  } else {
    return vals
  }
}


function set_value(id, value) {
  if (!(id in data_as_object)) {
    console.warn('Unrecognized key ' + id)
    return
  }

  var sel = $('#' + id)

  if (sel.data('select2')) {
    var split_val = value.split(',').filter(function(x) {
      return x.replace(' ', '') !== ''
    }),
        extracted_val = extract_concentrations(split_val),
        concentrations = {}
    // for multiple selections, add the options if it doesn't exist
    var ids = [], input_val = []
    sel.find('option').each(function() {
      ids.push($(this).val())
    })
    extracted_val.forEach(function(val_obj) {
      var val = val_obj.id
      if (ids.indexOf(val) === -1)
        sel.append('<option value="' + val + '">' + val + '</option>')
      // for the input
      input_val.push(val)

      // for the concentrations
      if (val_obj.concentration)
        concentrations[val] = val_obj.concentration
    })
    sel.val(input_val).trigger('change')

    // update the concentration
    if (Object.keys(concentrations).length > 0) {
      draw_concentrations(id,
                          data_as_object[id]['concentration_with_default'],
                          concentrations)
    }
  } else if (data_as_object[id]['type'] == 'date') {
    var date = new Date(value),
        date_str = [date.getFullYear(), date.getMonth(), date.getDate()].join('-')
    sel.val(date_str).trigger('change')
  } else {
    sel.val(value).trigger('change')
  }

  // update UI
  update_required_label(id, value)
  update_folder_name()
}


function update_required_label(id, value) {
  if (value === '') {
    $('#required-alert-' + id)
      .addClass('alert-danger')
      .removeClass('alert-success')
  } else {
    $('#required-alert-' + id)
      .addClass('alert-success')
      .removeClass('alert-danger')
  }
  check_required()
}


function add_form_container(html, label, required, id, description, custom, multiple) {
  var required_str, custom_mult_str, description_str
  if (required)
    required_str = '<span id="required-alert-' + id + '" class="required alert alert-danger" role="alert">(Required)</span>'
  else
    required_str = ''

  if (custom && multiple)
    custom_mult_str = ' (Choose one or more, including custom values)'
  else if (custom)
    custom_mult_str = ' (Choose or enter a new value)'
  else if (multiple)
    custom_mult_str = ' (Choose one or more)'
  else
    custom_mult_str = ''

  if (description)
    description_str = '<div>' + description + '</div>'
  else
    description_str = ''

  return '<div class="form-group row"><div class="col-sm-6"><label>' + label + '</label>' + custom_mult_str +
    required_str + description_str +
    '</div><div class="col-sm-6">' + html + '</div></div>'
}


function add_dropdown_options(input_sel, options, options_data, def, select_options) {
  var options_html = ''
  for (var i = 0; i < options.length; i++) {
    var opt = options[i],
        selected_str = opt === def ? ' selected="selected"' : ''
    options_html += '<option value="'+ opt + '"' + selected_str + '>' + opt + '</option>'
  }

  input_sel.html(options_html)
  if (options_data) {
    select_options['templateResult'] = function(state) {
      return state.id + ': ' + options_data[state.id]
    }
    select_options['matcher'] = function (params, data) {
      // check both the 3-letter-id and the explanation text
      if ($.trim(params.term) === '' ||
          data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1 ||
          options_data[data.text].toLowerCase().indexOf(params.term.toLowerCase()) > -1) {
        return data
      }
      return null
    }
  }

  // initialize select2
  input_sel.select2(select_options)

  // to avoid the default tag
  if (!def) input_sel.val([]).trigger('change')
}


function extract_concentrations(vals) {
  /** Get the ids and concentrations from strings like "Glucose(2)" */

  var out = []
  for (var i=0, l=vals.length; i<l; i++) {
    var t = vals[i],
        res = /(.*)\(([0-9.]+)\)/.exec(t)
    if (_.isNull(res))
      out.push({ id: t, concentration: null })
    else
      out.push({ id: res[1], concentration: res[2] })
  }
  return out
}


function draw_concentrations(id, def, value_dict) {
  if (_.isUndefined(value_dict)) value_dict = {}

  var sel = d3.select(d3.select('#' + id).node().parentNode)
        .selectAll('.concentration-input')
        .data(get_value(id, true), function(d) { return d; })
  var div = sel.enter()
        .append('div')
        .attr('class', 'concentration-input')
  div.append('span')
    .text(function(d) { return d + ' concentration (g/L)'; })
  div.append('input').attr('type', 'number')
    .attr('id', function(d) { return d; })
    .attr('class', 'form-control')
    .attr('min', '0')
    .attr('max', '1000')
    .attr('value', function(d) {
      return (d in value_dict) ? value_dict[d] : def
    })

  sel.exit().remove()
}


function create_input(data, parent_sel, autofocus) {
  var label = data['label'],
      id = data['id'],
      required = data['required'],
      description = data['description'],
      type = data['type'],
      def = data['default'] || '',
      example = data['example'] || '',
      options = data['options'],
      options_function = data['options_function'],
      multiple = data['multiple'],
      custom = data['custom'],
      concentrations = data['concentrations'],
      min = data['min'],
      html = '',
      autofocus_str = autofocus ? ' autofocus' : '',
      after_append

  // check for some required attributes
  if (!id) console.error('No ID for ' + label)
  if (options && (type !== 'dropdown'))
    console.error('Has "options" with a type that is not "dropdown" for ' + label)
  if (min && (type !== 'number'))
    console.error('Has "min" with a type that is not "number" for ' + label)

  if (type == 'dropdown') {
    var select_options = {
      'allowClear': true,
      'placeholder': '',
    }
    // multiple selections
    if (multiple) {
      select_options['multiple'] = true
    }
    // custom options
    if (custom) {
      select_options['tags'] = true
      select_options['createTag'] = function(query) {
        return {
          id: query.term,
          text: query.term + ' (custom)',
          tag: true
        }
      }
    }
    if (!required) {

    }
    html = '<select id="' + id + '" style="width: 100%" ' + autofocus_str + '></select>'

    after_append = function() {
      // prefer options to options_function
      if (!options && options_function) {
        options_function(function(options, options_data) {
          add_dropdown_options($('#' + id), options, options_data, def, select_options)
        })
      } else {
        add_dropdown_options($('#' + id), options, null, def, select_options)
      }
      if (!_.isUndefined(data['concentration_with_default'])) {
        $('#' + id).on('change', function() {
          draw_concentrations(id, data['concentration_with_default'])
        })
      }
      // when clearing, close the menu
      $('#' + id).on('select2:unselecting', function (e) {
        $(this).select2('val', '');
        e.preventDefault();
      });
    }
  } else if (type === 'date') {
    html = '<input type="text" class="form-control" id="' + id + '" value="' + def + '"' +
      ' placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >',
    after_append = function() {
      $('#' + id).datepicker({ format: 'yyyy-mm-dd' })
    }
  } else if (type === 'textarea') {
    html = '<textarea id="' + id + '" class="form-control" value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" ></textarea>'
  } else if (type === 'number' ){
    html = '<input id="' + id + '" type="number" class="form-control" min="' + min + '"' +
      ' value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >'
    after_append = function() {
      $('#' + id).bootstrapNumber()
    }
  } else {
    html = '<input id="' + id + '" class="form-control" value="' + def + '" placeholder="' + example + '" ' + autofocus_str + ' style="width: 100%" >'
  }

  // create and run
  parent_sel.append(add_form_container(html, label, required, id, description, custom, multiple))
  // toggle the required label
  $('#' + id).on('change', function() {
    update_required_label(id, this.value)
    update_folder_name()
  })
  if (after_append) after_append()
}
