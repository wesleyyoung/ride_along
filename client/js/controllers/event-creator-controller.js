/**
 * Created by I97143 on 6/8/2016.
 */
(function(){
    'use strict';
    
    angular.module('event-creator-controller', [])
        .controller('event-creator-controller', eventCreatorController);

    eventCreatorController.$inject=["listFactory", "$mdDialog", "$mdMedia", "$timeout", "$http"];
    
    function eventCreatorController(listFactory, $mdDialog, $mdMedia, $timeout, $http){
        var ecc = this;
        var today = new Date();

        ecc.$http=$http;

        ecc.regions=listFactory.regions();
        ecc.products=listFactory.products();

        ecc.assignProvinces=assignProvinces;
        ecc.assignCounties=assignCounties;
        
        ecc.minDate1=new Date(today.getFullYear(), today.getMonth(), today.getDate()+2);
        ecc.minDate2=new Date(today.getFullYear(), today.getMonth(), today.getDate()+9);
        ecc.selectedProducts=[];
        ecc.selectedProvince={};
        ecc.notes = "";
        
        function assignProvinces(reg){
            return $timeout(function(){
                for(var i=0;i<ecc.regions.length;i++){
                    if(ecc.regions[i].name==reg){
                        ecc.selectedRegion=ecc.regions[i];
                        //ecc.selectedProvince = ecc.regions[i].provinces;
                        console.log(ecc.regions[i].name, reg)
                    }
                }
                console.log("hello")
            }, 650)

        }
        
        function assignCounties(prov){
            return $timeout(function(){
                for(var i=0;i<ecc.selectedRegion.provinces.length;i++){
                    if(ecc.selectedRegion.provinces[i].name==prov){
                        ecc.selectedProvince=ecc.selectedRegion.provinces[i];
                    }
                }
            }, 650)
        }

        ecc.showTabDialog = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'templates/confirmation-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(answer) {
                    
                }, function() {
                    
                }
            );
        };

        function DialogController($scope, $mdDialog) {

            var $http = ecc.$http;

            $scope.selectedRegion=ecc.selectedRegion;
            $scope.countyName=ecc.countyName;
            $scope.provinceName=ecc.provinceName;

            $scope.startDate=ecc.startDate;
            $scope.endDate=ecc.endDate;

            $scope.department = ecc.department;
            $scope.phone = ecc.phone;

            $scope.notes=ecc.notes;

            $scope.email=ecc.email;
            $scope.name = ecc.name;

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.confirm = function() {
                //window.alert('You confirmed the ride-along');
                var postObj = {
                    name: $scope.name,
                    email: $scope.email,
                    phone: $scope.phone,
                    department: $scope.department,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate,
                    region: $scope.selectedRegion.name,
                    province: $scope.provinceName,
                    county: $scope.countyName,
                    notes: $scope.notes,
                    creationDate: new Date(),
                    status: "UNAPPROVED"
                };
                $http.post('/formSubmit', postObj).then(function() {
                    console.log('Submition successful!');
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Submission Successful!')
                            .textContent('The appropriate vendors have been notified of your ride-along')
                            .ariaLabel('Submission Successful')
                            .ok('Got it!')
                    );
                }, function(err){
                    if(err)throw err;
                });
                $mdDialog.hide();
            };

        }
        
    }
    
    
    
})();