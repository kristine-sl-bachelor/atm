angular.module( 'app', [] )

	.controller( 'AtmController', function( $timeout ) {

		var vm = this; 

		var bank = {
			customers: [ { 
				name: 'Saint Nick', 
				cards: [ 
					{
						number: '1234 1234 1234 1234', 
						month: '12', 
						year: '18'
					} 
				], 
				accounts: [ 
					{
						name: 'spending account', 
						number: '1201.13.14151', 
						balance: 12345.67
					}, 
					{
						name: 'savings account', 
						number: '1201.13.14152', 
						balance: 123456.78
					} 
				], 
				payments: [
					{
						date: new Date(),
						from: '1201.13.14151', 
						to: '1201.13.14152', 
						amount: 123.45
					},
					{
						date: new Date(),
						from: '1201.13.14151', 
						to: '1201.13.14152', 
						amount: 123.45
					}
				]
			} ]
		}

		vm.actions = {
			main: 0,
			cancelPayment: 1, 
			buyVisaGiftCard: 2,
			changeInfo: 3,
			newCard: 4,
			payBill: 5,
			withdrawCash: 6,
			transferCash: 7
		}

		vm.currentAction = vm.actions.main; 
		// vm.currentCustomer = 0; 
		// vm.payments = bank.customers[ vm.currentCustomer ].payments;

		vm.interactive = false;
		vm.cardEjected = false;
		vm.cardTaken = false;  

		var static = "Please insert card";
		vm.onScreenText = static;

		vm.insertCard = function() {

			vm.currentCustomer = 0; 

			if( ! vm.interactive ) { 

				vm.cardInserted = ! vm.cardInserted;
				vm.cardTaken = false; 

				$timeout( function() {
					vm.interactive = true;
					vm.onScreenText = "What do you want to do?"; 
				}, 1700 ); 
			}
		}

		vm.toggleCard = function() {

			if( vm.cardEjected ) {

				vm.cardTaken = true; 
				vm.cardEjected = false; 
				vm.cardInserted = false;

			} else {

				vm.insertCard(); 
			} 
		}

		vm.ejectCard = function() {

			vm.cardEjected = true; 
			vm.interactive = false; 
		}

		vm.numberKey = function( number ) {

			vm.onScreenText = 'The number is: ' + number; 
		}

		vm.cancelPayment = function() {

			vm.payments = bank.customers[ vm.currentCustomer ].payments;
			vm.currentAction = vm.actions.cancelPayment; 
		}

		vm.buyVisaGiftCard = function() {

			vm.currentAction = vm.actions.buyVisaGiftCard; 
		}

		vm.changeInfo = function() {

			vm.currentAction = vm.actions.changeInfo; 
		}

		vm.newCard = function() {

			vm.currentAction = vm.actions.newCard; 
		}

		vm.payBill = function() {

			vm.currentAction = vm.actions.payBill; 
		}

		vm.withdrawCash = function() {

			vm.currentAction = vm.actions.withdrawCash; 
		}

		vm.transferCash = function() {

			vm.currentAction = vm.actions.transferCash; 
		}

	} )
	
	.controller( 'ReceiptsController', function( $timeout ) {

		var vm = this; 
		vm.items = [ {
			datetime: new Date(),
			description: 'Lorem Ipsum.',
			active: false,
			clickable: true
		},
		{
			datetime: new Date(),
			description: 'Lorem Ipsum 2.',
			active: false,
			clickable: true
		} ];

		vm.formatDate = function( datetime ) {
			return moment( datetime ).format( 'DD.MM.YY HH:mm' ); 
		} 

		vm.toggleActive = function ( index ) {
			if ( ! vm.items[ index ].clickable ) {
				return;
			}

			for ( var i = 0; i < vm.items.length; i ++ ) {
				if ( i !== index ) {
					vm.items[ i ].active = false;
				}
			}

			vm.items[ index ].active = ! vm.items[ index ].active;
			vm.items[ index ].clickable = false;

			$timeout( function() {
				vm.items[ index ].clickable = true;
			}, 1000 );
		}

	} )

	.controller( 'CardController', function() {

		var vm = this; 

		vm.cardNumber = '1234 1234 1234 1234'; 
		vm.month = '12'; 
		vm.year = '18'; 
	} );
