
QUnit.test( "Test_source_validation", function( assert ) {
  list = ["Only", "these", "words", "will", "match"]
  list_actual_values = ['MgSO4', 'Spectinomycin', 'Polymyxin B', 'Polymyxin E', 'Ampicillin', 'KH2PO4', 'Fructose', 'Glucose', 'Galactose', '(NH4)2SO4', 'Glutamine']
  match = "only(9)"
  mismatch1 = "random(10)"
  mismatch2 = "these"

  for (var i = 0; i < list_actual_values.length; i++) {

    match_actual = list_actual_values[i] + '(0.01)'
  }

  mismatch1_actual = 'Streptomycin(9)'
  mismatch2_actual = 'Streptomycin'

  assert.equal( source_validation(list,match) , true , "Match return true" );
  assert.notEqual( source_validation(list,mismatch1) , true, "Does not match return false" );
  assert.notEqual( source_validation(list,mismatch2) , true, "Does not match return false" );

  assert.equal( source_validation(list_actual_values,match_actual) , true , "Match return true" );
  assert.notEqual( source_validation(list,mismatch1_actual) , true, "Does not match return false" );
  assert.notEqual( source_validation(list,mismatch2_actual) , true, "Does not match return false" );
});

QUnit.test( "Test_dropdown_validation", function( assert ) {
  list = ["1", "2", "3", "4", "5"] //can choose any number in list
  list_actual_values = ['31', '36', '50', '62', '76', '100', 'Single-end reads', 'Paired-end reads', 'KAPA HyperPlus', 'KAPA Stranded RNA-seq', '300 Cycle', '500 Cycle', '600 Cycle']
  match = "1"
  mismatch = "10"


  for (var i = 0; i < list_actual_values.length; i++) {

    match_actual = list_actual_values[i]
  }

  mismatch1_actual = '76 Cycle'

  assert.equal( dropdown_validation(list,match) , true , "Match return true" );
  assert.notEqual( dropdown_validation(list,mismatch) , true, "Does not match return false" );
});

QUnit.test( "Test_get_value_spreadsheet", function( assert ) {
  header = ['header1', 'header2', 'header3']
  data_val = ['data1', 'data2', 'data3']
  header_actual = ["creator", "read-files", "ALE-number"]
  data_val_actual = ["Ify", "data.fq,jakshjdb.fq", "3"]
  final_array_match = [["header1","data1"],["header2","data2"],["header3","data3"]]
  final_array_match_actual = [["creator","Ify"],["read-files","data.fq,jakshjdb.fq"],["ALE-number","3"]]

  assert.deepEqual(get_value_spreadsheet(header,data_val) , final_array_match , "Return header matched to values in array" );

  assert.deepEqual(get_value_spreadsheet(header_actual,data_val_actual) , final_array_match_actual , "Return header matched to values in array" );
});

