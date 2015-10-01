/* put placeholders into each array element */
var data = [
    ['Date', 'datepicker', true, 'date', ''], 
    ['Data Type', 'data-type', true, 'input', ''], 
    ['Raw File Format', 'raw-file-format', true, 'dropdown', ['FASTQ','FASTA','BAM']],
    ['Organism', 'organism', true, 'dropdown', ['eco']], 
    ['Parent Strain', 'parent-strain', true, 'input', ''],
    ['Strain ID', 'strain-id', true, 'input', ''],
    ['Mutations', 'mutations', true, 'input', ''], 
    ['Antibody', 'antibody', false, 'input', ''],
    ['Growth Stage', 'growth-stage', true, 'input', ''], 
    ['Oxygen Availability', 'oxygen-availability', true, 'input', ''], 
    ['Sample Preparation Details', 'sample-preparation-details', false, 'input', ''], 
    ['Base Media', 'base-media', true, 'input', ''], 
    ['Carbon Source(s)', 'carbon-source', true, 'multi-dropdown', ['Glucose'],  
    ['Carbon Source(s)', 'carbon-source-custom', false, 'input', '']], 
    ['Concentration for each carbon source (g/L)', 'concentration', true, 'input-number', ''], 
    ['Nitrogen Source', 'nitrogen-source', true, 'multi-dropdown', ['NO3'],
    ['Nitrogen Source', 'nitrogen-source-custom', false, 'input']], 
    ['Phosphorous Source', 'phosphorous-source', true, 'multi-dropdown', ['PO4'],
    ['Phosphorous Source', 'phosphorous-source-custom', false, 'input']], 
    ['Sulphur Source', 'sulphur-source', true, 'multi-dropdown', ['Sulphur'],
    ['Sulphur Source', 'sulphur-source-custom', false, 'input']], 
    ['Antibiotic Resistance', 'antibiotic-resistance', true, 'input'], 
    ['Replicates', 'replicates', false, 'input'], 
    ['Other Experimental Variables', 'other-experimental-variables', false, 'input'], 
    ['Sequencer', 'sequencer', false, 'multi-dropdown', ['Miseq'], 
    ['Sequencer', 'sequencer-custom', false, 'input']], 
    ['Read Length', 'read-length', false, 'input'], 
    ['Illumina Kit Details', 'illumina-kit-details', false, 'input'], 
    ['Experiment Summary and Hypothesis', 'experiment-summary', false, 'textarea'], 
    ['Experimentalist', 'experimentalist', false, 'input'], 
    ['Experimentalist Email', 'experimentalist-email', false, 'input'], 
    ['Grant ID', 'grant-id', false, 'input'], 
    ['Kit Used to Isolate DNA/RNA', 'isolate-kit', false, 'input'], 
    ['SOP Title', 'sop-title', false, 'input'], 
    ['Alignment Algorithm and Options', 'alignment-algorithm', false, 'input'], 
    ['Reference Sequence', 'reference-sequence', false, 'input'], 
    ['Other Processing Details', 'other-processing-details', false, 'input'], 
    ['GEO Submission', 'geo-submission', false, 'input'], 
    ['Author(s)', 'author', true, 'input'],  
    ['State of Preculture', 'state-of-preculture', false, 'input'], 
    ['Media of Preculture', 'media-of-preculture', false, 'input'], 
    ['Flasks Since Frozen Stock', 'flasks', false, 'input'], 
    ['Time Point', 'time-point', false, 'input']
]

$(document).ready(function(){

    /*$('#sequencer').select2({
        placeholder: "Select Sequencers",
        allowClear: true
    });
   */ 

    for(i=0;i<data.length;i++){
        
        $('#center-column').append(createHtml(data[i]));
        bindFunction(data[i]);
    }
    $("#submitForm").click(function(){
        
        var array = []
        for(i = 0; i< data.length; i++){
            var val = getValue(data[i]);
            if(val == 'Empty'){
                alertIncomplete(data[i][1]);
                return;
            }
            else{
                array.push([data[i][1], val]);
            }
        }
        saveFile(array);
    });
    
});

function saveFile(array){
    
    var csv = []
    csv.push(new CSV(array).encode());
    var file = new Blob(csv, {type: "text/plain;charset=utf-8"});
    saveAs(file, "example.csv");
    
}

function alertIncomplete(input){
    alert( input + ' is required')
}

function getValue(data){
       var value = $('#'+data[1]).val();  
       if(data[2] == true){
            if (value  == ''){
                //alertIncomplete(data[0]);  
                return 'Empty';
            }
            else{
                return value;
            }
       }
       else{
            return value;
       }
}

function bindFunction(data){
       if(data[3] == 'multi-dropdown'){
            $('#'+data[1]).select2();
       }
       else if (data[3] == 'date'){
            $('#'+data[1]).datepicker();
       }
       else{

       }
}

function createHtml(data){
    //if length of data is longer or is multi input use the additional array to add extra input
    console.log('1');
    var required = '';
    if(data[2] == false){
        required = '';
    }
    else{
        required = '(Required)';
    }
    var text = data[0];
    var input = data[1];
    var html = '';
    if (data[3] == 'dropdown'){
        var options = ''; 
        for(i = 0; i < data[4].length; i++){
            options += '<option value ="'+ data[4][i] + '">'+data[4][i]+'</option>';
        }
        html = '<div class="panel panel-info"><div class="panel-heading">'+text+' '+required+'</div><div class="panel-body"><select id="'+input+'">'+options+'</select></div></div>';
    }
    else if (data[3] == 'multi-dropdown'){
        var options = '';
        for(x=0; x < data[4].length; x++){
            options += '<option value ="'+ data[4][x] + '">'+data[4][x]+'</option>';
        }
        html = '<div class="panel panel-info"><div class="panel-heading">'+text+' '+required+'</div><div class="panel-body"><select id="'+input+'" multiple="multiple" style="width:100%;">'+options+'</select><br>or<br> <input id="' +data[5][1]+ '" type="text" class="col-sm-12 col-md-12 col-lg-12" style="padding-left:5px;"></div></div>';
    }
    else {
        html = '<div class="panel panel-info"><div class="panel-heading">'+text+' '+required+'</div><div class="panel-body"><input id="'+input+'"></div></div>';
    }
    return html;
}
