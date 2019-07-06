var fuelPrice = 2.269;
var userInputs = {
	startLocation: undefined,
	endLocation: undefined,
	people: undefined,
	days: undefined,
	vehicleId: undefined
};
var vehicles = [
	{
		id: 0,
		type: "bike",
		btnImage: "images/bikeSimpleWhite.svg",
		artImage: "images/bikeSimpleWhiteFill.png",
		minPeople: 1,
		maxPeople: 1,
		minDays: 1,
		maxDays: 5,
		priceDay: 109,
		fuelPer100: 3.7
	},
	{
		id: 1,
		type: "smallCar",
		btnImage: "images/smallCarWhite.svg",
		artImage: "images/smallCarWhiteFill.png",
		minPeople: 1,
		maxPeople: 2,
		minDays: 1,
		maxDays: 10,
		priceDay: 129,
		fuelPer100: 8.5
	},
	{
		id: 2,
		type: "largeCar",
		btnImage: "images/bigCarWhite.svg",
		artImage: "images/bigCarWhiteFill.png",
		minPeople: 1,
		maxPeople: 5,
		minDays: 3,
		maxDays: 10,
		priceDay: 144,
		fuelPer100: 9.7
	},
	{
		id: 3,
		type: "moterHome",
		btnImage: "images/moterHomeWhite.svg",
		artImage: "images/moterHomeWhiteFill.png",
		minPeople: 2,
		maxPeople: 6,
		minDays: 2,
		maxDays: 15,
		priceDay: 200,
		fuelPer100: 17
	}
];

var stateCheckSubmit = true;
var stateCheckBack = false;
var distanceCheck;

var formContainer = $('#formContainer');
var mapContainer = $('#mapContainer');

// These elements have to deal with the google maps api, so they cant use jquery
var startLocation = document.getElementById('startLocation');
var startAutoComp = new google.maps.places.Autocomplete(startLocation);
var endLocation = document.getElementById('endLocation');
var endAutoComp = new google.maps.places.Autocomplete(endLocation);
var amountPeople = document.getElementById('people');
var amountDays = document.getElementById('days');

var vehiclesContainer = $('#vehiclesContainer');
var noCars = $('#noCars');

var submitBtn = $('#submitBtn');
var backBtn = $('#backBtn');

var backgroundDiv = $('#backgroundDiv');
var carImageDiv = $('#car');
var carImage = $('#vehicleImage');
var backGround = $('#backGround');
var midGround = $('#midGround');
var forGround = $('#forGround');
backGround.css('background-position-x', '0px');
midGround.css('background-position-x', '0px');
forGround.css('background-position-x', '0px');

var backgroundStep = 0;

setInterval(() => {
	backGround.css('background-position-x', ((parseInt(backGround.css('background-position-x')) + backgroundStep) + 'px'));
}, 40);

setInterval(() => {
	midGround.css('background-position-x', ((parseInt(midGround.css('background-position-x')) + backgroundStep) + 'px'));
}, 20);

setInterval(() => {
	forGround.css('background-position-x', ((parseInt(forGround.css('background-position-x')) + backgroundStep) + 'px'));
}, 9);



startAutoComp.setComponentRestrictions(
	{
		'country': ['nz']
	}
);
endAutoComp.setComponentRestrictions(
	{
		'country': ['nz']
	}
);

startAutoComp.addListener('place_changed', () => {
	userInputs.startLocation = startAutoComp.getPlace();
	endLocation.parentNode.classList.remove('disabled');
	endLocation.disabled = false;

	startLocation.parentNode.classList.remove('redText');
	startLocation.classList.remove('selected');
});

endAutoComp.addListener('place_changed', () => {
	let location = endAutoComp.getPlace();

	if (userInputs.startLocation.place_id == location.place_id) {
		endLocation.parentNode.classList.add('redText');
		endLocation.classList.add('selected');
	} else {
		userInputs.endLocation = location;

		amountPeople.parentNode.classList.remove('disabled');
		amountPeople.disabled = false;

		endLocation.parentNode.classList.remove('redText');
		endLocation.classList.remove('selected');
	}
});

amountPeople.addEventListener('input', () => {
	if (amountPeople.value > 0) {
		userInputs.people = Math.floor(amountPeople.value);

		amountDays.parentNode.classList.remove('disabled');
		amountDays.disabled = false;

		amountPeople.parentNode.classList.remove('redText');
		amountPeople.classList.remove('selected');
		if (amountDays.value) {
			userInputs.days = Math.floor(amountDays.value);
			vehiclesContainer.removeClass('disabled');
		}
	} else {
		amountPeople.parentNode.classList.add('redText');
		amountPeople.classList.add('selected');

		userInputs.people = undefined;
		userInputs.days = undefined;

		amountDays.parentNode.classList.add('disabled');
		amountDays.disabled = true;

		vehiclesContainer.addClass('disabled');
		submitBtn.addClass('disabled');
		submitBtn.attr('disabled', true);
		removeVehicleSelect();
	}
	valadateVehicles();
});

amountDays.addEventListener('input', () => {
	if (amountDays.value > 0) {
		userInputs.days = Math.floor(amountDays.value);
		vehiclesContainer.removeClass('disabled');

		amountDays.parentNode.classList.remove('redText');
		amountDays.classList.remove('selected');
	} else {
		amountDays.parentNode.classList.add('redText');
		amountDays.classList.add('selected');

		userInputs.days = undefined;

		vehiclesContainer.addClass('disabled');
		submitBtn.addClass('disabled');
		submitBtn.attr('disabled', true);
		removeVehicleSelect();
	}
	valadateVehicles();
});


[].forEach.call(document.querySelectorAll('.vehicleBtn'), (e) => {
	let vehicleBtn = $(e);
	vehicleBtn.click(() => {
		if (!vehicleBtn.parent().parent().hasClass('disabled')) {
			removeVehicleSelect();
			vehicleBtn.addClass('selected');
			userInputs.vehicleId = vehicleBtn.data('vehicleId');
			submitBtn.removeClass('disabled');
			submitBtn.attr('disabled', false);

			let parentContainer = $('.vehicles');

			parentContainer.removeClass('selected');
			parentContainer.parent().removeClass('redText');

			carImage.attr('src', vehicles[userInputs.vehicleId].artImage);
		}
	});
});

function removeVehicleSelect () {
	userInputs.vehicleId = undefined;
	carImage.attr('src', 'images/questionMark.svg');
	[].forEach.call(document.querySelectorAll('.vehicleBtn'), (v) => {
		$(v).removeClass('selected');
	});
}

function valadateVehicles () {
	let people = userInputs.people;
	if (!people) {
		people = -1;
	}

	let days = userInputs.days;
	if (!days) {
		days = -1;
	}

	for (var i = 0; i < vehicles.length; i++) {
		let fail1 = false;
		let fail2 = false;

		if (people < vehicles[i].minPeople || people > vehicles[i].maxPeople) {
			if (people > 0) {
				fail1 = true;
			}
		}

		if (days < vehicles[i].minDays || days > vehicles[i].maxDays) {
			if (days > 0) {
				fail2 = true;
			}
		}

		let currentBtn = $('.vehicleBtn[data-vehicle-id="' + vehicles[i].id + '"]');

		if (fail1 || fail2) {
			if (currentBtn.hasClass('selected')) {
				currentBtn.removeClass('selected');
				userInputs.vehicleId = undefined;
				carImage.attr('src', 'images/questionMark.svg');
			}
			currentBtn.hide();
		} else {
			currentBtn.css('display', 'flex');
			noCars.hide();
		}
	}
	let btnCheck = 0;
	[].forEach.call(document.querySelectorAll('.vehicleBtn'), (e) => {
		if (e.style.display == 'none') {
			btnCheck++;
		}
	});
	if (btnCheck == 4) {
		noCars.css('display', 'flex');
	}

}

submitBtn.click(() => {
	initMap();
	let valueCheck = true;
	for (var key in userInputs) {
		if (userInputs.hasOwnProperty(key)) {
			if (userInputs[key] == undefined) {
				let invalidInput;
				if (key != 'vehicleId') {
					invalidInput = $('#' + key);
				} else {
					invalidInput = $('.vehicles');
				}
				invalidInput.addClass('selected');
				invalidInput.parent().addClass('redText');

				valueCheck = false;
			}
		}
	}

	if (valueCheck && stateCheckSubmit) {
		processValues();
	}
});

backBtn.click(() => {
	if (stateCheckBack) {
		stateCheckSubmit = true;
		stateCheckBack = false;


		backgroundStep = 1;

		carImage.css('transform', 'scaleX(-1)');

		backGround.addClass('reverse').delay(5000).queue((next) => {
			backGround.removeClass('reverse').addClass('paused');
			carImage.css('transform', 'none');
			next();
		});
		midGround.addClass('reverse').delay(5000).queue((next) => {
			midGround.removeClass('reverse').addClass('paused');
			next();
		});
		forGround.addClass('reverse').delay(5000).queue((next) => {
			forGround.removeClass('reverse').addClass('paused');
			next();
		});


		backBtn.css('transition', 'none').fadeOut(1000, () => {
			$(this).hide();
		});

		carImageDiv.css('transition', '5s ease-in-out').removeClass('active').delay(5000).queue((next) => {
			carImageDiv.css('transition', 'none');
			next();
		});

		backgroundDiv.css('transition', '5s ease-in-out').removeClass('active').delay(5000).queue((next) => {
			backgroundDiv.css('transition', 'none');
			next();
		});

		formContainer.css('transition', '5s ease-in-out').removeClass('active').delay(5000).queue((next) => {
			formContainer.css('transition', 'none');
			next();
		});

		mapContainer.css('transition', '5s ease-in-out').removeClass('active').delay(5000).queue((next) => {
			mapContainer.css('transition', 'none');
			next();
			backgroundStep = 0;
		});
	}
});

var map;
var nzLat = -40.8112764;
var nzLng = 172.9096165;

function initMap () {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: nzLat,
			lng: nzLng
		},
		zoom: 5,
		disableDefaultUI: true,
		scrollwheel: false,
		navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,
		draggable: false,
		draggableCursor: 'null',
		styles: [
			{
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#2b2544'
					}
				]
			},
			{
				'elementType': 'labels.text.fill',
				'stylers': [
					{
						'color': '#fbfcff'
					}
				]
			},
			{
				'elementType': 'labels.text.stroke',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'administrative.land_parcel',
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#7a3f52'
					}
				]
			},
			{
				'featureType': 'landscape.man_made',
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#2b2544'
					}
				]
			},
			{
				'featureType': 'landscape.natural',
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#2b2544'
					}
				]
			},
			{
				'featureType': 'poi.attraction',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.business',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.government',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.medical',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.park',
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#43396a'
					}
				]
			},
			{
				'featureType': 'poi.park',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.place_of_worship',
				'elementType': 'geometry',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.place_of_worship',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.school',
				'elementType': 'geometry',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.school',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.sports_complex',
				'elementType': 'geometry',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'poi.sports_complex',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'road.arterial',
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#992562'
					}
				]
			},
			{
				'featureType': 'road.highway',
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#e52562'
					}
				]
			},
			{
				'featureType': 'road.local',
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#582062'
					}
				]
			},
			{
				'featureType': 'transit',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'transit.line',
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#a1003f'
					}
				]
			},
			{
				'featureType': 'transit.station.airport',
				'elementType': 'geometry.fill',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			},
			{
				'featureType': 'transit.station.airport',
				'elementType': 'geometry.stroke',
				'stylers': [
					{
						'color': '#992562'
					}
				]
			},
			{
				'featureType': 'water',
				'elementType': 'geometry',
				'stylers': [
					{
						'color': '#1d1831'
					}
				]
			},
			{
				'featureType': 'water',
				'elementType': 'labels',
				'stylers': [
					{
						'visibility': 'off'
					}
				]
			}
		]
	});
}

function processValues () {
	var timeSpan = $('#time');
	var distanceSpan = $('#distance');
	var costSpan = $('#cost');

	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();

	let panel = document.getElementById('directionsInfo')
	panel.innerHTML = '';

	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(panel);

	directionsService.route({
		origin: userInputs.startLocation.geometry.location,
		destination: userInputs.endLocation.geometry.location,
		travelMode: 'DRIVING'
	}, (response, status) => {
		if (status == 'OK') {
			directionsDisplay.setDirections(response);

			let timeResponse = response.routes[0].legs[0].duration.value;

			let travelTime = Math.floor(timeResponse / 60 / 60);
			let travelDayTime = userInputs.days * 24;

			if (travelTime >= travelDayTime) {
				distanceCheck = false;
			} else {
				distanceCheck = true;
			}

			timeSpan.text(travelTime + 'h ' + (timeResponse % 60) + 'm');

			let distanceResponce = response.routes[0].legs[0].distance.value;
			distanceSpan.text(Math.floor(distanceResponce / 1000) + 'km');

			let distanceTraveled = Math.ceil(distanceResponce / 1000);
			let costPerDay = vehicles[userInputs.vehicleId].priceDay;
			let costDayTrip = costPerDay * userInputs.days;

			let totalCost = ((distanceTraveled / 100) * vehicles[userInputs.vehicleId].fuelPer100 * fuelPrice) + costDayTrip;
			costSpan.text('$' + (Math.round(totalCost * 100) / 100));

		} else {
			console.log(status);
			console.log('There was an error in google maps. Please try again soon');
			distanceCheck = false;
		}
		triggerAnimation();
	});
}

function triggerAnimation () {
	if (distanceCheck) {

		stateCheckBack = true;
		stateCheckSubmit = false;

		backgroundStep = -1;

		carImageDiv.css('transition', '5s ease-in-out').addClass('active').delay(5000).queue((next) => {
			carImageDiv.css('transition', 'none');
			next();
		});

		backgroundDiv.css('transition', '5s ease-in-out').addClass('active').delay(5000).queue((next) => {
			backgroundDiv.css('transition', 'none');
			next();
		});

		formContainer.css('transition', '5s ease-in-out').addClass('active').delay(5000).queue((next) => {
			formContainer.css('transition', 'none');
			next();
		});

		mapContainer.css('transition', '5s ease-in-out').addClass('active').delay(5000).queue((next) => {
			mapContainer.css('transition', 'none');
			backBtn.css('display', 'flex').hide().fadeIn(1000, () => {
				$(this).css('transition', '0.3s');
			});
			next();
		})

	} else {
		Snackbar.show({
			pos: 'bottom-center',
			text: 'The travel time is longer than the days specified. Please change your options.'
		});
	}
}

var directionsCheck = false;
$('#directionsBtn').click(() => {
	if (!directionsCheck) {
		$('#directions').addClass('open');
		$('#directionsInfo').addClass('open');
	} else {
		$('#directions').removeClass('open');
		$('#directionsInfo').removeClass('open');
	}
	directionsCheck = !directionsCheck;
});
