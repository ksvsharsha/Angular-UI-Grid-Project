var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav']); 
app.controller('MainCtrl', ['$scope', function ($scope) {
    debugger;
  $scope.gridOptions = {  };
  $scope.gridOptions.enableCellEditOnFocus = true;
 
  $scope.gridOptions.columnDefs = [
    { name: 'SNo', enableCellEdit: false },
    { name: 'Activity Date', type:'date', cellFilter:'date:"yyyy-MM-dd' },
    { name: 'Employee Name', enableCellEdit:true },
    { name: 'Program' , editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%',
      editDropdownValueLabel: 'Program', editDropdownOptionsArray: [
      { id: 1, program: 'IB Services - Spartan' },
      { id: 2, program: 'CCD - MultiSpeciality' },
      { id: 3, program:'IB Services - Tejas'  },
      {id:4, program: 'IB Services - WIIFIT'}]
    },
    { name: 'Sprint Number', enableCellEdit:false},
    { name: 'Sprint Start Date', type:'date', cellFilter:'date:"yyyy-MM-dd' },
    { name: 'Sprint End Date', type:'date', cellFilter:'date:"yyyy-MM-dd'},
    { name: 'Activity', editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%',
       editDropdownValueLabel: 'Activity', editDropdownOptionsArray: [
      { id: 1, Activity: 'Coding' },
      { id: 2, Activity: 'Testing' },
      { id: 3, Activity:'No Activity Assigned'  }
      ]
    },
    {name:'Category',editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%',
       editDropdownValueLabel: 'Category', editDropdownOptionsArray: [
      { id: 1, Category: 'User Story' },
      { id: 2, Category: 'SPR' },
      { id: 3, Category:'ALM Defect'  }
      ]
    },
    {name:'Reference ID',enableCellEdit:true},
    {name:'Status',editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%',
       editDropdownValueLabel: 'Status', editDropdownOptionsArray: [
      { id: 1, program: 'On Track' },
      { id: 2, program: 'Possibility of Risk' },
      { id: 3, program:'At Risk'  },
      ]
    },
    {name:'Comments',editableCellTemplate:true}
    ];
 
 
      $scope.gridOptions.data = [{SNo:"1",ActivityDate:"1stFeb,16",EmployeeName:"Shaik Abdul Rawoof",
      Program:"IB Services Spartan",SprintNumber:"Giza Sprint 5",SprintStartDate:"20-Jan-16",SprintEndDate:"2-Feb-16",
      Activity:"Coding",Category:"SPR",ReferenceID:"64778",Status:"On Track",Comments:"All Good"}];
                                 
   
 
    $scope.currentFocused = "";
 
    
 
    $scope.gridOptions.onRegisterApi = function(gridApi){
       $scope.gridApi = gridApi;
      
    };
}]);
