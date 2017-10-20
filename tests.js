
QUnit.test( "Test_source_validation", function( assert ) {
  list = ["Only", "these", "words", "will", "match"]
  match = "only(9)"
  mismatch1 = "random(10)"
  mismatch2 = "these"
  assert.equal( source_validation(list,match) , true , "Match return true" );
  assert.notEqual( source_validation(list,mismatch1) , true, "Does not match return false" );
  assert.notEqual( source_validation(list,mismatch2) , true, "Does not match return false" );
});

QUnit.test( "Test_dropdown_validation", function( assert ) {
  list = ["1", "2", "3", "4", "5"] //can choose any number in list
  match = "1"
  mismatch = "10"
  assert.equal( dropdown_validation(list,match) , true , "Match return true" );
  assert.notEqual( dropdown_validation(list,mismatch) , true, "Does not match return false" );
});

QUnit.test( "Test_get_value_spreadsheet", function( assert ) {
  header = ['header1', 'header2', 'header3']
  data_val = ['data1', 'data2', 'data3']
  final_array_match = [["header1","data1"],["header2","data2"],["header3","data3"]]
  assert.deepEqual(get_value_spreadsheet(header,data_val) , final_array_match , "Return header matched to values in array" );
});

