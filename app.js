var app = angular.module('app', ['ngTouch', 'ngAnimate' , 'ui.grid','ui.grid.edit','ui.grid.resizeColumns', 'ui.grid.pagination','ui.grid.moveColumns', 'ui.grid.cellNav', 'ui.grid.exporter', 'ui.grid.selection']);

app.controller('MainCtrl', ['$scope', '$http', '$interval','uiGridConstants', '$q', function ($scope, $http, $interval, uiGridConstants,$q) {
  var fakeI18n = function( title ){
    var deferred = $q.defer();
    $interval( function() {
      deferred.resolve( 'col: ' + title );
    }, 1000, 1);
    return deferred.promise;
  };
  var database = TAFFY().store("DAT");


var getdata = database().get("DAT");

  $scope.msg = {};
  debugger;

  $scope.gridOptions = {
        enableFiltering: true,
enableCellEditOnFocus : true,
    exporterMenuCsv: true,
    enableGridMenu: true,
    
   columnDefs: [
      { name:'SNo', enableFiltering:false, enableCellEdit: false,width: '7%'},
      {name: 'ActivityDate',enableFiltering:false,cellTooltip: false,enableCellEdit:true, type:'date', cellFilter:'date:"dd-MM-yyyy"',width: '15%'},
      { name: 'EmployeeName' ,enableCellEdit:true ,width: '20%',cellTooltip: true},
      { field: 'Program',enableFiltering:true,cellTooltip: true,
      filter: {
          //term: '3',
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '1', label: 'IB Services - Spartan' }, { value: '2', label: 'CCD - MultiSpeciality' }, { value: '3', label: 'IB Services - Tejas'} ,{value:'4', label:'IB Services - WIIFIT'},{value:'5',label:'VOCAB Web Tool'} ,{value:'6', label:'Denials IQ - SQL'} ]
        },
        
      
      editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%',headerCellClass: $scope.highlightFilteredHeader,
      cellFilter: 'mapProgram', editDropdownValueLabel: 'Program', editDropdownOptionsArray: [
      { id: 1, Program: 'IB Services - Spartan' },
      { id: 2, Program: 'CCD - MultiSpeciality' },
      { id: 3, Program:'IB Services - Tejas'  },
      { id: 4, Program: 'IB Services - WIIFIT'},
      { id: 5, Program: 'VOCAB Web Tool'},
      { id: 6, Program: 'Denials IQ - SQL'}
      ]},
      { name: 'SprintNumber',enableCellEdit:true,width: '15%' ,cellTooltip: true},
      {name:'SprintStartDate',enableFiltering:false,enableCellEdit:true, cellTooltip: false,type:'date', cellFilter:'date:"yyyy-MM-dd"',width: '15%'},
      {name:'SprintEndDate',enableFiltering:false,type:'date', enableCellEdit:true, cellFilter:'date:"yyyy-MM-dd"',width: '15%',cellTooltip: false},
      {name:'Activity',
      filter: {
          //term: '1',
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '1', label: 'Coding' }, { value: '2', label: 'Testing' }, { value: '3', label: 'No Activity Assigned'}   ]
        },
      enableFiltering:true,editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',
      cellFilter: 'mapActivity', editDropdownValueLabel: 'Activity',cellTooltip: true, editDropdownOptionsArray: [
      { id: 1, Activity: 'Coding' },
      { id: 2, Activity: 'Testing' },
      { id: 3, Activity:'No Activity Assigned'}
      ]},
      {name:'Category',enableFiltering:true,enableCellEdit:true,
      filter: {
          //term: '2',
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '1', label: 'User Story' }, { value: '2', label: 'SPR' }, { value: '3', label: 'ALM Defect'}   ]
        },
      editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',cellTooltip: true,
      cellFilter: 'mapCategory', editDropdownValueLabel: 'Category', editDropdownOptionsArray: [
      { id: 1, Category: 'User Story' },
      { id: 2, Category: 'SPR' },
      { id: 3, Category:'ALM Defect'  }
      ]},
      {name:'ReferenceID', enableFiltering:true,enableCellEdit:true,width: '15%',cellTooltip: true},
      {name:'Status',enableFiltering:true,enableCellEdit:true,
      filter: {
          //term: '3',
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '1', label: 'On Track' }, { value: '2', label: 'Possibility of Risk' }, { value: '3', label: 'At Risk'}   ]
        },
       editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',cellTooltip: true,
       cellClass: function(grid,row,col,rowRenderIndex,colRenderIndex){
        if(row.entity.Status == 1)
          return "green";
        else if(row.entity.Status == 2){
          return "amber";
        }
        else
          return "red";
       },
        
      cellFilter: 'mapStatus', editDropdownValueLabel: 'Status', editDropdownOptionsArray: [
      { id: 1, Status: 'On Track' },
      { id: 2, Status: 'Possibility of Risk' },
      { id: 3, Status:'At Risk'  },
      ]

    },
      {name:'Comments',enableFiltering:false,enableCellEdit:true, width:'20%',cellTooltip: true}
      
    ],
    gridMenuCustomItems: [
      {
        title: 'Rotate Grid',
        action: function ($event) {
          this.grid.element.toggleClass('rotated');
        },
        order: 210
      }
    ],
     data : getdata,
    onRegisterApi: function( gridApi ){
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
        $scope.gridOptions.cellClass = $scope.getStatus(rowEntity);
        var json = {};
         json[colDef.name] = newValue;
           database({SNo:rowEntity.SNo}).update(json);
localStorage.setItem( 'taffy_DAT',
                  JSON.stringify( database().get()) );

         });


$scope.getStatus = function(rowEntity){
        if(rowEntity.Status == 1)
          return "green";
        else if(rowEntity.Status == 2){
          return "amber";
        }
        else
          return "red";
       }
      // interval of zero just to allow the directive to have initialized
     $interval( function() {
        gridApi.core.addToGridMenu( gridApi.grid, [{ title: 'Dynamic item', order: 100}]);
      }, 0, 1);

      gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
        $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
      });
    }
  };
$scope.filter = function() {
    $scope.gridApi.grid.refresh();
  };

  
  
  /*Function to Add New Rows*/
    $scope.addData = function() {
    var n = $scope.gridOptions.data.length + 1;
    var row  = {
                "SNo": n,
                "ActivityDate":"",
                "EmployeeName":"",
                "Program": "",
                "SprintNumber": "",
                "SprintStartDate":"",
                "SprintEndDate":"",
                "Activity":"",
                "Category":"",
                "ReferenceID":"",
                "Status":"",
                "Comments":""
              }
    $scope.gridOptions.data.push(row);


   database.insert(row);

            


  };

  /*Function to Delete selected row*/
  $scope.deleteSelected = function(rowEntity){


      angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
      $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
      database({SNo:data.SNo}).remove();
      });

    }

    

  $scope.singleFilter = function( renderableRows ){
    var matcher = new RegExp($scope.filterValue);
    renderableRows.forEach( function( row ) {
      var match = false;
      [  'ActivityDate', 'EmployeeName','Program','SprintNumber','SprintStartDate','SprintEndDate','Activity','Category','ReferenceID','Status','Comments' ].forEach(function( field ){
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
    4: 'IB Services - WIIFIT',
    5: 'VOCAB Web Tool',
    6: 'Denials IQ - SQL'

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
