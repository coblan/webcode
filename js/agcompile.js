


function input_hole() {
	document.write("<div style='display:none' ng-app='he'><span ng-controller='hole' id='hole'></span></div>")
}

function compileAngularElement( ele,target_ctr) {

        //var elSelector = (typeof elSelector == 'string') ? elSelector : null ;  
        //    // The new element to be added
        //if (elSelector != null ) {
            //var $div = $( elSelector );

                // The parent of the new element
                //var $target = p_ele//$("[ng-app]");

              angular.element(target_ctr).injector().invoke(['$compile', function ($compile) {
                        var $scope = angular.element(target_ctr).scope();
                        $compile(ele)($scope);
                        // Finally, refresh the watch expressions in the new element
                        $scope.$apply();
                    }]);
            //}

        }

module.exports={
	compileAngularElement:compileAngularElement,
	input_hole:input_hole,
	
	
}