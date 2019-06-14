// Добавление мероприятия в общий массив

let eventArr = [];
let button = document.querySelector('button');
let addingInputs = document.querySelectorAll('.addEventField');
let regExp = [ , , /^(((0|1)?[0-9])|(2[0-3])):[0-5][0-9]$/, /^(((0|1)?[0-9])|(2[0-3])):[0-5][0-9]$/];
let numOfDateBoxShown = -1;
let selectorOption = document.querySelectorAll('.dateSelector option');
let dateSelector = document.querySelector('.dateSelector');
let eventT = document.querySelectorAll('.event');

function addEvent(){
	let funcArr = [function(){obj.name = addingInputs[0].value}, function(){dateArr.push(addingInputs[1].value)}, function(){obj.startTime = addingInputs[2].value}, function(){obj.endTime = addingInputs[3].value}];
	let obj = {};
	let dateArr = [];
	let inputsAreValid = true
	// inputs validation
	for (let i = 0; i < 2; i++){
		if(addingInputs[i].value.length == 0){
			addingInputs[i].classList.add('invalid');
			inputsAreValid = false;
		}
		else{
			funcArr[i]();
			addingInputs[i].classList.remove('invalid');
		}
	}
	for(let i = 2; i < addingInputs.length; i++){
		if(!addingInputs[i].value.match(regExp[i]) || addingInputs[i].value < "09:00" || addingInputs[i].value > "18:00" || addingInputs[2].value > addingInputs[3].value){
			addingInputs[i].classList.add('invalid');
			inputsAreValid = false;
		}
		else{
			funcArr[i]();
			addingInputs[i].classList.remove('invalid');
		}
	}
	if(inputsAreValid){
		obj.ID = new Date().getUTCMilliseconds();
		checkTimeAndPush(dateArr, obj);
	}
}
button.addEventListener('click', function(){
	addEvent();
	sortByDate();
	console.log(eventArr);
	selectorOption = document.querySelectorAll('.dateSelector option');
	// addListeners();
	rewrite();
});

function checkTimeAndPush(dateArr, obj){
	let dateIsIn = false;
	let objIsIn = false;
	let objIsAdded = false
	let i = 0;
	let j = 0;
	for (i = 0; i < eventArr.length; i++){
		if(eventArr[i][0] == dateArr[0]){
			dateIsIn = true;
			if(obj.endTime <= eventArr[i][1].startTime){
				stickEventInside(1);
				objIsAdded = true;
				objIsIn = true;
			}
			else{
				for (j = 1; j < eventArr[i].length; j++){
					if (eventArr[i][j].endTime >= obj.startTime) {
						break;
					}
				}
			}
			break;
		}
	}
	if (!dateIsIn){
		eventArr.push(dateArr);
	}
	if(!objIsIn){
		if(eventArr[i][j + 1]){
			if(obj.endTime <= eventArr[i][j].startTime){
				stickEventInside(j);
				objIsAdded = true;
			}
		}
		else if (eventArr[i][j]){
			if(eventArr[i][j].startTime != obj.startTime && eventArr[i][j].endTime != obj.endTime){
				if (j == 0 || obj.startTime >= eventArr[i][j].endTime) {
					eventArr[i].push(obj);
					objIsAdded = true;
				}
				else if(obj.endTime <= eventArr[i][j].startTime){
					stickEventInside(j);
					objIsAdded = true;
				}
			}
		}
		else {
			eventArr[i].push(obj);
			objIsAdded = true;
		}
	}
	if (!objIsAdded) {
		console.warn('Это время уже занято!');
	}
	function stickEventInside(numOfElement){
			let tempArr = eventArr[i].splice(numOfElement, (eventArr[i].length - numOfElement + 1));
			eventArr[i].push(obj);
			for (let k = 0; k < tempArr.length; k++){
				eventArr[i].push(tempArr[k]);
			}
	}
}

function sortByDate(){
	let tempArr = [];
	if(eventArr.length > 1){
		eventArr.sort(function(a, b){
			if(a[0] > b[0]){
				return 1;
			}
			else if (a[0] < b[0]){
				return -1;
			}
			else{
				return 0;
			}
		})
	}
}

// перерисока содержимого списка

function rewrite(){
	let eventsList = document.querySelector('#eventsList');
	let dateBoxes = document.querySelectorAll('.dateBox');
	dateSelector = document.querySelector('.dateSelector');
	selectorOption = document.querySelectorAll('.dateSelector option');
	for (let i = 0; i < dateBoxes.length; i++){
		eventsList.removeChild(dateBoxes[i]);
	}
	for (let i = 1; i < selectorOption.length; i++){
		dateSelector.removeChild(selectorOption[i]);
	}
	for (let i = 0; i < eventArr.length; i++){
		let element = document.createElement('div');
		element.classList.add('dateBox');
		if(numOfDateBoxShown == -1){
			element.classList.add('shown');
		}
		else if (i == numOfDateBoxShown){
			element.classList.add('shown');
		}
		eventsList.appendChild(element);

		element = document.createElement('div');
		element.classList.add('dateTitle');
		let strArr = eventArr[i][0].split("-");
		let str = strArr[2] + '.' + strArr[1] + '.' + strArr[0];
		element.innerText = str;
		dateBoxes = document.querySelectorAll('.dateBox');
		dateBoxes[(dateBoxes.length - 1)].appendChild(element);

		element = document.createElement('option');
		element.innerText = str;
		element.id = 'event' + i;
		dateSelector.appendChild(element);

		element = document.createElement('ul');
		element.classList.add('events');
		dateBoxes[(dateBoxes.length - 1)].appendChild(element);

		let eventsUl = document.querySelectorAll('.events');

		for (let j = 1; j < eventArr[i].length; j++){
			element = document. createElement('li');
			element.classList.add('event');
			element.id = eventArr[i][j].ID;
			eventsUl[i].appendChild(element);

			eventT = document.querySelectorAll('.event');
			eventT[eventT.length - 1].addEventListener('click', function(event){
				if (event.target.classList.contains('fa-times')){
					deleteTask(event.target.parentNode); //parentNode - обращаемся к род. элем
				}
				if (event.target.classList.contains('fa-edit')){
					editTask(event.target.parentNode); //parentNode - обращаемся к род. элем
				}
			});

			let eventLi = document.querySelectorAll('.event');
			element = document.createElement('p');
			element.classList.add('eventName');
			element.innerText = eventArr[i][j].name;
			eventLi[eventLi.length - 1].appendChild(element);

			element = document.createElement('p');
			element.classList.add('timeFrom');
			element.innerText = eventArr[i][j].startTime;
			eventLi[eventLi.length - 1].appendChild(element);

			element = document.createElement('p');
			element.classList.add('timeTo');
			element.innerText = eventArr[i][j].endTime;
			eventLi[eventLi.length - 1].appendChild(element);

			element = document.createElement('i');
			element.classList.add('fas');
			element.classList.add('fa-edit');
			eventLi[eventLi.length - 1].appendChild(element);

			element = document.createElement('i');
			element.classList.add('fas');
			element.classList.add('fa-times');
			eventLi[eventLi.length - 1].appendChild(element);
		}
	}
}

// реализация функционала dateSelector

function decr (i) {
	numOfDateBoxShown = i;
}

function makeDecr (i){
	return function (){
		decr(i);
	}
}

function addListeners(){
	for(let i = 0; i < selectorOption.length - 1; i++){
		let item = 'event' + i;
		document.getElementById(item).onclick = makeDecr(i);
	}
}

// удаление мероприятий

function deleteTask(el) {
	var task = el.getAttribute('id');
	for (let m = 0; m < eventArr.length; m++){
		let length = eventArr[m].length
		for (let n = 0; n < length; n++){
			if (eventArr[m][n].ID == task){
				eventArr[m].splice(n, 1);
				if (eventArr[m].length <= 1) {
					eventArr.splice(m, 1);
				}
			}
		}
	}
	rewrite();
}

// редактирование мероприятий

function editTask(el){
	document.querySelector('.editEvent').classList.add('editOn');

}

// сохранение в локаль с соответствующим рефакторингом