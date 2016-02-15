var app = angular.module('app', ['ngTouch', 'ngAnimate' ,'ui.grid','ui.grid.edit','ui.grid.resizeColumns', 'ui.grid.pagination','ui.grid.moveColumns', 'ui.grid.cellNav', 'ui.grid.exporter', 'ui.grid.selection']);

app.controller('MainCtrl', ['$scope', '$http', '$interval', '$q', function ($scope, $http, $interval, $q) {
  var fakeI18n = function( title ){
    var deferred = $q.defer();
    $interval( function() {
      deferred.resolve( 'col: ' + title );
    }, 1000, 1);
    return deferred.promise;
  };
  var database = TAFFY().store("DAT");

var getdata = database().get("DAT");
//database({SNo:"1"}).update({EmployeeName:"asdfasdf sdg asdf asdf"});
//getdata = database().get("DAT");
  $scope.msg = {};
  debugger;
  $scope.gridOptions = {
        enableFiltering: true,

    exporterMenuCsv: true,
    enableGridMenu: true,
    
   columnDefs: [
      { name:'SNo', enableFiltering:false, enableCellEdit: false,width: '7%'
      },
      {name: 'ActivityDate',cellTooltip: 'Double Click To Edit',type:'date', cellFilter:'date:"yyyy-MM-dd"',width: '15%'},
      { name: 'EmployeeName' ,enableCellEdit:true ,width: '20%',cellTooltip: 'Double Click To Edit'},
      { name: 'Program',cellTooltip: 'Double Click To Edit',editableCellTemplate: 'ui-grid/dropdownEditor', width: '15%',
      cellFilter: 'mapProgram', editDropdownValueLabel: 'Program', editDropdownOptionsArray: [
      { id: 1, Program: 'IB Services - Spartan' },
      { id: 2, Program: 'CCD - MultiSpeciality' },
      { id: 3, Program:'IB Services - Tejas'  },
      {id: 4, Program: 'IB Services - WIIFIT'}]},
      { name: 'SprintNumber',enableCellEdit:true,width: '15%' ,cellTooltip: 'Double Click To Edit'},
      {name:'SprintStartDate',cellTooltip: 'Double Click To Edit',type:'date', cellFilter:'date:"yyyy-MM-dd"',width: '15%'},
      {name:'SprintEndDate',type:'date', cellFilter:'date:"yyyy-MM-dd"',width: '15%',cellTooltip: 'Double Click To Edit'},
      {name:'Activity',editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',
      cellFilter: 'mapActivity', editDropdownValueLabel: 'Activity',cellTooltip: 'Double Click To Edit', editDropdownOptionsArray: [
      { id: 1, Activity: 'Coding' },
      { id: 2, Activity: 'Testing' },
      { id: 3, Activity:'No Activity Assigned'  }
      ]},
      {name:'Category',editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',cellTooltip: 'Double Click To Edit',
      cellFilter: 'mapCategory', editDropdownValueLabel: 'Category', editDropdownOptionsArray: [
      { id: 1, Category: 'User Story' },
      { id: 2, Category: 'SPR' },
      { id: 3, Category:'ALM Defect'  }
      ]},
      {name:'ReferenceID', enableCellEdit:true,width: '15%',cellTooltip: 'Double Click To Edit'},
      {name:'Status',
       editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',cellTooltip: 'Double Click To Edit',
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
      {name:'Comments',enableCellEdit:true, width:'20%',cellTooltip: 'Double Click To Edit'}
      
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
