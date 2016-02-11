var app = angular.module('app', ['ngTouch', 'ui.grid','ui.grid.edit', 'ui.grid.cellNav']);
app.controller('MainCtrl', ['$scope',  function ($scope) {
  
  $scope.gridOptions = {
    enableFiltering: false,
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
      $scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
    },
    columnDefs: [
      { name: 'SNo' ,enableCellEdit: false,width: '5%'},
      {name: 'ActivityDate',type:'date', cellFilter:'date:"yyyy-MM-dd"',width: '10%'},
      { name: 'EmployeeName' ,enableCellEdit:true ,width: '20%'},
      { name: 'Program',editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%',
      cellFilter: 'mapProgram', editDropdownValueLabel: 'Program', editDropdownOptionsArray: [
      { id: 1, Program: 'IB Services - Spartan' },
      { id: 2, Program: 'CCD - MultiSpeciality' },
      { id: 3, Program:'IB Services - Tejas'  },
      {id: 4, Program: 'IB Services - WIIFIT'}]},
      { name: 'SprintNumber',enableCellEdit:true,width: '10%' },
      {name:'SprintStartDate',type:'date', cellFilter:'date:"yyyy-MM-dd"',width: '10%'},
      {name:'SprintEndDate',type:'date', cellFilter:'date:"yyyy-MM-dd"',width: '10%'},
      {name:'Activity',editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',
      cellFilter: 'mapActivity', editDropdownValueLabel: 'Activity', editDropdownOptionsArray: [
      { id: 1, Activity: 'Coding' },
      { id: 2, Activity: 'Testing' },
      { id: 3, Activity:'No Activity Assigned'  }
      ]},
      {name:'Category',editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',
      cellFilter: 'mapCategory', editDropdownValueLabel: 'Category', editDropdownOptionsArray: [
      { id: 1, Category: 'User Story' },
      { id: 2, Category: 'SPR' },
      { id: 3, Category:'ALM Defect'  }
      ]},
      {name:'ReferenceID',enableCellEdit:true,width: '10%'},
      {name:'Status',editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',
      cellFilter: 'mapStatus', editDropdownValueLabel: 'Status', editDropdownOptionsArray: [
      { id: 1, Status: 'On Track' },
      { id: 2, Status: 'Possibility of Risk' },
      { id: 3, Status:'At Risk'  },
      ]},
      {name:'Comments',enableCellEdit:true, width:'20%'}
      
      
    ],
    data : [{SNo:"1",ActivityDate:"1stFeb,16",EmployeeName:"Shaik Abdul Rawoof",
      Program:"1",SprintNumber:"Giza Sprint 5",SprintStartDate:"20-Jan-16",SprintEndDate:"2-Feb-16",
      Activity:"1",Category:"1",ReferenceID:"64778",Status:"1",Comments:"All Good"
      },
      {SNo:"2",ActivityDate:"2ndFeb16",EmployeeName:"Harsha",Program:"2",SprintNumber:"Giza Sprint 6",SprintStartDate:"10-feb-2016",
        SprintEndDate:"5-Feb-16",Activity:"2",Category:"2",ReferenceID:"438282",Status:"2",Comments:"Good"}],
      enableCellEditOnFocus : true,

  };

  $scope.filter = function() {
    $scope.gridApi.grid.refresh();
  };
    
  $scope.singleFilter = function( renderableRows ){
    var matcher = new RegExp($scope.filterValue);
    renderableRows.forEach( function( row ) {
      var match = false;
      [ 'SNo', 'ActivityDate', 'EmployeeName','Program','SprintNumber','SprintStartDate','SprintEndDate','Activity','Category','ReferenceID','Status','Comments' ].forEach(function( field ){
        if ( row.entity[field].match(matcher) ){
          match = true;
        }
      });
      if ( !match ){
        row.visible = false;
      }
    });
    return renderableRows;
  };
}])
.filter('mapProgram', function() {
  var ProgramHash = {
    1: 'IB Services - Spartan',
    2: 'CCD - MultiSpeciality',
    3: 'IB Services - Tejas',
    4: 'IB Services - WIIFIT'
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return ProgramHash[input];
    }
  };

})
.filter('mapActivity', function() {
  var ActivityHash = {
    1: 'Coding',
    2: 'Testing',
    3: 'No Activity Assigned'
    
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return ActivityHash[input];
    }
  };

})
.filter('mapCategory', function() {
  var CategoryHash = {
    1: 'User Story',
    2: 'SPR',
    3: 'ALM Defect'
    
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return CategoryHash[input];
    }
  };

})
.filter('mapStatus', function() {
  var StatusHash = {
    1: 'On Track',
    2: 'Possibility of Risk',
    3: 'At Risk'
    
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return StatusHash[input];
    }
  };

});

