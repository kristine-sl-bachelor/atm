angular.module( 'app', [] )
	
	.controller( 'AtmController', function( $scope ) {

		var vm = this; 
		vm.interactive = false;

		vm.onScreenText = "Please insert card";

		vm.insertCard = function() {
			
			vm.interactive = true;
			vm.onScreenText = "Card inserted"; 
		}

		vm.numberKey = function( number ) {

			vm.onScreenText = "The number is: " + number; 
		}

	} 
); 
