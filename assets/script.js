var data = [['Date', 'datepicker', true, 'date'], 
['Data Type', 'data-type', true, 'input'], ['Raw File Format', 'raw-file-format', true, 'dropdown'], ['Organism', 'organism', true, 'dropdown'], 
['Parent Strain', 'parent-strain', true, 'input'], ['Strain ID', 'strain-id', true, 'input'], ['Mutations', 'mutations', true, 'input'], 
['Antibody', 'antibody', false, 'input'], ['Growth Stage', 'growth-stage', true, 'input'], ['Oxygen Availability', 'oxygen-availability', true, 'input'], 
['Sample Preparation Details', 'sample-preparation-details', false, 'input'], ['Base Media', 'base-media', true, 'input'], ['Carbon Source(s)', 'carbon-source', true, 'multi-dropdown'], 
['Carbon Source(s)', 'carbon-source-custom', false, 'input'], ['Concentration for each carbon source (g/L)', 'concentration', true, 'input-number'], 
['Nitrogen Source', 'nitrogen-source', true, 'multi-dropdown'],['Nitrogen Source', 'nitrogen-source-custom', false, 'input'], ['Phosphorous Source', 'phosphorous-source', true, 'multi-dropdown'],
['Phosphorous Source', 'phosphorous-source-custom', false, 'input'], ['Sulphur Source', 'sulphur-source', true, 'multi-dropdown'],['Sulphur Source', 'sulphur-source-custom', false, 'input'], 
['Antibiotic Resistance', 'antibiotic-resistance', true, 'input'], ['Replicates', 'replicates', false, 'input'], ['Other Experimental Variables', 'other-experimental-variables', false, 'input'], 
['Sequencer', 'sequencer', false, 'multi-dropdown'], ['Sequencer', 'sequencer-custom', false, 'input'], ['Read Length', 'read-length', false, 'input'], ['Illumina Kit Details', 'illumina-kit-details', false, 'input'], 
['Experiment Summary and Hypothesis', 'experiment-summary', false, 'textarea'], ['Experimentalist', 'experimentalist', false, 'input'], ['Experimentalist Email', 'experimentalist-email', false, 'input'], 
['Grant ID', 'grant-id', false, 'input'], ['Kit Used to Isolate DNA/RNA', 'isolate-kit', false, 'input'], ['SOP Title', 'sop-title', false, 'input'], ['Alignment Algorithm and Options', 'alignment-algorithm', false, 'input'], 
['Reference Sequence', 'reference-sequence', false, 'input'], ['Other Processing Details', 'other-processing-details', false, 'input'], ['GEO Submission', 'geo-submission', false, 'input'], ['Author(s)', 'author', true, 'input'],  
['State of Preculture', 'state-of-preculture', false, 'input'], ['Media of Preculture', 'media-of-preculture', false, 'input'], ['Flasks Since Frozen Stock', 'flasks', false, 'input'], ['Time Point', 'time-point', false, 'input'] ]

$(document).ready(function(){

    /*$('#sequencer').select2({
        placeholder: "Select Sequencers",
        allowClear: true
    });
    
    $('#test2').select2();
    $( "#datepicker" ).datepicker();*/

    for(i=0;i<data.length;i++){
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
