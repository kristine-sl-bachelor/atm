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
						name: 'Spending account', 
						number: '1201.13.14151', 
						balance: 12345.67
					}, 
					{
						name: 'Savings account', 
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
			newCard: 4,
			payBill: 5,
			withdrawCash: 6,
			transferCash: 7, 
			confirm: 8, 
			pin: 9
		}

		vm.currentAction = vm.actions.main; 
		// vm.currentCustomer = 0; 

		vm.interactive = false;
		vm.cardEjected = false;
		vm.cardTaken = false;

		vm.reset = function() {

			vm.giftCardBought = false; 
			vm.numberKeysPressed = []; 
			vm.wrongPin = false; 

			vm.transfer = {
				modes: {
					to: 1,
					amount: 3
				}, 
				currentMode: 0, 
				to: '', 
				amount: ''
			};
		}

		vm.reset(); 

		var static = "Please insert card";
		vm.onScreenText = static;


		vm.addNumberKey = function( number ) {
			
			if( vm.currentAction != vm.actions.main || vm.currentAction != vm.actions.blank ) {

				vm.numberKeysPressed.push( number );
			}

			if( vm.currentAction == vm.actions.pin ) {

				if( vm.numberKeysPressed.length == 4) {

					$timeout( function() {
						vm.currentAction = vm.actions.main; 
						vm.interactive = true;
						vm.onScreenText = "What do you want to do?";
						vm.reset();   
					}, 400 ); 
				}
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
					vm.currentAction = vm.actions.pin;  
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
			vm.reset(); 
		}

		vm.buyVisaGiftCard = function() {

			vm.currentAction = vm.actions.buyVisaGiftCard; 
			vm.reset(); 
		}

		vm.newCard = function() {

			vm.currentAction = vm.actions.newCard; 
			vm.reset(); 
		}

		vm.payBill = function() {

			vm.currentAction = vm.actions.payBill; 
			vm.reset(); 
		}

		vm.withdrawCash = function() {

			vm.currentAction = vm.actions.withdrawCash; 
			vm.reset(); 
		}

		vm.transferCash = function() {

			vm.currentAction = vm.actions.transferCash; 
			vm.reset(); 
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

			vm.money.invalid = false; 
			vm.money.noFunds = false; 

			var amount = parseInt( vm.getKeypadNumbersAsString() );
			var rest = amount; 

			vm.numberKeysPressed = []; 

			if( amount > bank.customers[ vm.currentCustomer ].accounts[0].balance ) {

				vm.money.noFunds = true; 
				return; 
			}

			var oneThousand = Math.floor( rest / 1000 ); 
			if( oneThousand ) rest -= oneThousand * 1000;

			var fiveHundred = Math.floor( rest / 500 ); 
			if( fiveHundred ) rest -= fiveHundred * 500; 

			var twoHundred = Math.floor( rest / 200 ); 
			if( twoHundred ) rest -= twoHundred * 200; 
			
			var oneHundred = Math.floor( rest / 100 ); 
			if( oneHundred ) rest -= oneHundred * 100;

			var fifty = Math.floor( rest / 50 ); 
			if( fifty ) rest -= fifty * 50; 

			if( rest ) {
				vm.money.invalid = true; 
				return; 
			} 

			bank.customers[ vm.currentCustomer ].accounts[0].balance -= amount;  

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

		vm.setAccount = function( account, index ) {

			if( account == 0 ) { // From 

				vm.transfer.from = index; 
				if( vm.transfer.to == index ) vm.transfer.to = ''; 

			} else { // To
				vm.transfer.to = index; 
				if( vm.transfer.from == index ) vm.tranfer.from = ''; 
			}
		}

		vm.transfer = function() {

			if( vm.transfer.to == '' || vm.transfer.from == '' ) return; 
			var amount = parseInt( vm.getKeypadNumbersAsString() );

			var from = vm.getCustomer().accounts[ vm.transfer.from - 1 ]; 
			var to = vm.getCustomer().accounts[ vm.transfer.to - 1 ]; 

			from.balance -= amount; 
			to.balance += amount; 

			vm.transfer.to = ''; 
			vm.transfer.from = ''; 

			vm.numberKeysPressed = []; 
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
