var data = [['date', 'datepicker', true, 'date'], ['data type', 'data-type', 'true', 'input'] ]

$(document).ready(function(){

    $('#sequencer').select2({
        placeholder: "Select Sequencers",
        allowClear: true
    });
    
    $('#test2').select2();
    $( "#datepicker" ).datepicker();
    var array = []
    for(int i = 0; i< data.length(); i++){
        array.push([data[i][0], getValue(data[1])]);
    }

    $("#submitForm").click(function(){
        saveFile(array);
    });
    
});

function saveFile(array){
    
    //var data = [[$('#datepicker').val(), 20, 0, 1, 1017281], [1850, 20, 0, 2, 1003841]];
    //var array = [[data[1][0], getValue(data[1])]];
    var csv = []
    csv.push(new CSV(array).encode());
    var file = new Blob(csv, {type: "text/plain;charset=utf-8"});
    saveAs(file, "example.csv");
    
}

function alertIncomplete(input){
    alert( input + 'is required')
}

function getValue(data){
       if(data[2] == true){
            if ($('#'+data[1]).val() == ''){
                alertIncomplete(data[0]);    
            }
            else{
                return $('#'+data[1]).val();
            }
       }
       else{
            return $('#'+data[1]).val();
       }
}
function bindFunction(data){
       if(data[3] == 'select2'){
            $('#'+data[1]).select2();
       }
       else if (data[3] == 'date'){
            $('#'+data[1]).datepicker();
       }
       else{

       }
}
