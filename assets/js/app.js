angular.module( 'app', [] )

	.controller( 'AtmController', function( $timeout, $log, $q ) {

		var vm = this; 

		var bank = {
			customers: [ {
				name: 'Saint Nick',
				address: 'North pole 1', 
				postcode: '0001', 
				email: 'santa@claus.com', 
				phone: '12345678', 

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

		vm.money = {
			fifty: [],
			oneHundred: [], 
			twoHundred: [], 
			fiveHundred: [], 
			oneThousand: [], 
			invalid: false, 
			noFunds: false
		}

		vm.actions = {
			blank: 0, 
			main: 1,
			cancelPayment: 2, 
			buyVisaGiftCard: 3,
			changeInfo: 4,
			newCard: 5,
			payBill: 6,
			withdrawCash: 7,
			transferCash: 8, 
			confirm: 9
		}

		vm.currentAction = vm.actions.main; 

		vm.interactive = false;
		vm.cardEjected = false;
		vm.cardTaken = false;  

		vm.reset = function() {

			vm.giftCardBought = false; 
			vm.numberKeysPressed = []; 
		}

		vm.reset(); 

		var static = "Please insert card";
		vm.onScreenText = static;


		vm.addNumberKey = function( number ) {
			
			if( vm.currentAction != vm.actions.main || vm.currentAction != vm.actions.blank ) {

				vm.numberKeysPressed.push( number );
			}
		}

		vm.getKeypadNumbersAsString = function() {

			var output = ''; 

			for( var i = 0; i < vm.numberKeysPressed.length; i++ ) {

				output += vm.numberKeysPressed[i]; 
			}

			return output; 
		}

		vm.confirm = function() {
			vm.confirmFunc = arguments[  arguments.length - 1 ]; 
			vm.confirmArgs = arguments;
			vm.previousAction = vm.currentAction; 
			vm.currentAction = vm.actions.confirm; 
		}

		vm.confirmed = function() {
			if ( ! vm.confirmFunc || ! vm.confirmArgs ) return;
			vm.confirmFunc.apply( this, vm.confirmArgs );
			vm.currentAction = vm.previousAction; 
		}

		vm.cancel = function() {
			vm.currentAction = vm.previousAction; 
		}

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
			vm.onScreenText = static; 
		}

		vm.numberKey = function( number, func ) {
			func.apply( this, arguments ); 
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

		vm.deletePayment = function ( payment ) {

			var index = vm.payments.indexOf( payment ); 
			vm.payments.splice( index, 1 ); 
		}

		vm.orderGiftCard = function() {

			vm.giftCardBought = true; 
			vm.numberKeysPressed = [];
		}

		vm.withdraw = function() {

			var amount = parseInt( vm.getKeypadNumbersAsString() );

			vm.numberKeysPressed = []; 

			if( amount > bank.customers[ vm.currentCustomer ].accounts[0].balance ) {

				vm.money.noFunds = true; 
				return; 
			}

			var oneThousand = Math.floor( amount / 1000 ); 
			if( oneThousand ) amount -= oneThousand * 1000;

			var fiveHundred = Math.floor( amount / 500 ); 
			if( fiveHundred ) amount -= fiveHundred * 500; 

			var twoHundred = Math.floor( amount / 200 ); 
			if( twoHundred ) amount -= twoHundred * 200; 
			
			var oneHundred = Math.floor( amount / 100 ); 
			if( oneHundred ) amount -= oneHundred * 100;

			var fifty = Math.floor( amount / 50 ); 
			if( fifty ) amount -= fifty * 50; 

			if( amount ) {
				vm.money.invalid = true; 
				return; 
			} 

			vm.money.invalid = false; 

			for( var i = 0; i < oneThousand; i++ ) {
				vm.money.oneThousand.push( true ); 
			}
			for( var i = 0; i < fiveHundred; i++ ) {
				vm.money.fiveHundred.push( true ); 
			}
			for( var i = 0; i < twoHundred; i++ ) {
				vm.money.twoHundred.push( true ); 
			}
			for( var i = 0; i < oneHundred; i++ ) {
				vm.money.oneHundred.push( true ); 
			}
			for( var i = 0; i < fifty; i++ ) {
				vm.money.fifty.push( true ); 
			}

		}

		vm.back = function() {

			vm.currentAction = vm.actions.main; 
			vm.reset(); 
		}

		vm.getCustomer = function() {

			return bank.customers[ vm.currentCustomer ];
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
