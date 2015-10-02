/* put placeholders into each array element */
var data = [
    ['Date', 'date', true, 'date', '', ''], 
    ['Data Type', 'data-type', true, 'input', 'mRNA', 'Unknown'], 
    ['Raw File Format', 'raw-file-format', true, 'dropdown', ['FASTQ','FASTA','BAM']],
    ['Organism', 'organism', true, 'dropdown', ['eco']], 
    ['Parent Strain', 'parent-strain', true, 'input', 'K-12 MG1655', 'K-12 MG1655'],
    ['Strain ID', 'strain-id', true, 'input', 'BOP27', ''],
    ['Mutations', 'mutations', true, 'input', 'deltaCRP', ''], 
    ['Antibody', 'antibody', false, 'input', 'anti-CRP', ''],
    ['Growth Stage', 'growth-stage', true, 'input', 'mid-log (OD=0.5)', 'mid-log'], 
    ['Oxygen Availability', 'oxygen-availability', true, 'input', 'O2,NO3, SO4,etc', 'O2'], 
    ['Sample Preparation Details', 'sample-preparation-details', false, 'input', '', ''], 
    ['Base Media', 'base-media', true, 'input', 'M9', 'M9'], 
    ['Carbon Source(s)', 'carbon-source', true, 'multi-dropdown', ['Glucose'],  
    ['Carbon Source(s)', 'carbon-source-custom', false, 'input', '']], 
    ['Concentration for each carbon source (g/L)', 'concentration', true, 'input-number', '', ''], 
    ['Nitrogen Source', 'nitrogen-source', true, 'multi-dropdown', ['NO3'],
    ['Nitrogen Source', 'nitrogen-source-custom', false, 'input']], 
    ['Phosphorous Source', 'phosphorous-source', true, 'multi-dropdown', ['PO4'],
    ['Phosphorous Source', 'phosphorous-source-custom', false, 'input']], 
    ['Sulphur Source', 'sulphur-source', true, 'multi-dropdown', ['Sulphur'],
    ['Sulphur Source', 'sulphur-source-custom', false, 'input']], 
    ['Antibiotic Resistance', 'antibiotic-resistance', true, 'input', 'Kanamycin (50 ug/ml)', ''], 
    ['Replicates', 'replicates', false, 'input', '', ''], 
    ['Other Experimental Variables', 'other-experimental-variables', false, 'input', '', ''], 
    ['Sequencer', 'sequencer', false, 'multi-dropdown', ['Miseq'], 
    ['Sequencer', 'sequencer-custom', false, 'input']], 
    ['Read Length', 'read-length', false, 'input', '50', ''], 
    ['Illumina Kit Details', 'illumina-kit-details', false, 'input', '50 cycle kit PE', '50 cycle kit PE'], 
    ['Experiment Summary and Hypothesis', 'experiment-summary', false, 'textarea', ''], 
    ['Experimentalist', 'experimentalist', false, 'input', '', 'Unknown'], 
    ['Experimentalist Email', 'experimentalist-email', false, 'input', '', 'Unknown'], 
    ['Grant ID', 'grant-id', false, 'input', '', ''], 
    ['Kit Used to Isolate DNA/RNA', 'isolate-kit', false, 'input', 'Qiagen', 'Unknown'], 
    ['SOP Title', 'sop-title', false, 'input', '', ''], 
    ['Alignment Algorithm and Options', 'alignment-algorithm', false, 'input', 'Bowtie2', 'Bowtie2'], 
    ['Reference Sequence', 'reference-sequence', false, 'input', 'NC_000913.3', 'Unknown'], 
    ['Other Processing Details', 'other-processing-details', false, 'input', '', ''], 
    ['GEO Submission', 'geo-submission', false, 'input', 'GDS5093', ''], 
    ['Author(s)', 'author', true, 'input', 'Zachary A. King, zakandrewking@gmail.com, UCSD', ''],  
    ['State of Preculture', 'state-of-preculture', false, 'input', 'stationary phase overnight, exponential phase', ''], 
    ['Media of Preculture', 'media-of-preculture', false, 'input', 'LB,M9', ''], 
    ['Flasks Since Frozen Stock', 'flasks', false, 'input', '3', ''], 
    ['Time Point', 'time-point', false, 'input', '200s', '']
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
    //alert( input + ' is required')
    var error_string = '';
    for(z = 0; z < data.length; z++){
        if( getValue(data[z]) == 'Empty'){
            error_string += data[z][0] + ' is required\n';
        }
    

    }
    alert(error_string);
}

function getValue(data){
       var value = $('#'+data[1]).val();  
       if(data[3] == 'multi-dropdown'){
            value += $('#'+data[5][1]).val();
       }
       console.log(value);
       if(data[2] == true){
            if (value  == '' || value == 'null' || typeof value == 'undefined'){
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
        html = '<div class="form-group"><label>'+text+' '+required+'</label><br><select id="'+input+'">'+options+'</select></div>';
    }
    else if (data[3] == 'multi-dropdown'){
        var options = '';
        for(x=0; x < data[4].length; x++){
            options += '<option value ="'+ data[4][x] + '">'+data[4][x]+'</option>';
        }
        html = '<div class="form-group"><label>'+text+' '+required+'</label><br><select id="'+input+'" multiple="multiple" style="width:100%;">'+options+'</select><br>or<br><input id="' +data[5][1]+ '" type="text" class="col-sm-12 col-md-12 col-lg-12" style="padding-left:5px;"></div><br>';
    }
    else if(data[3] == 'textarea'){

        html = '<div class="form-group"><label>'+text+' '+required+'</label><br><textarea id="'+input+'"></textarea></div>';
    }
    else {
        html = '<div class="form-group"><label>'+text+' '+required+'</label><br><input id="'+input+'" value="'+data[5]+'" placeholder="'+data[4]+'"></div>';
    }
    return html;
}
