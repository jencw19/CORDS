
let selection = []

//


//generate client id
//https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)

	);

}

// console.log(uuidv4());


// clear a div
//https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}



//function to find html text that needs to be replaced by json data
function replaceText(textKeyName, content) {
	var placeholderElements = document.querySelectorAll(".replaceText");
	for (var j = 0; j < placeholderElements.length; j++) {
		// see if text content matches {{textKeyName}}
		if (placeholderElements[j].textContent === '{{' + textKeyName + '}}') {
			console.log('found opt', textKeyName);
			placeholderElements[j].innerHTML = content;
			break;
		}
	}
};


//language selection menu
function populateSelect() {

	// get json array
	$.getJSON('languages.json', function (jsonData) {
		const arr = Object.keys(jsonData).map((key) => [key, jsonData[key]]);
		console.log(arr);

		var opt = document.getElementById('sel');
		for (var i = 0; i < arr.length; i++) {

			// populate select opt with the json
			opt.innerHTML = opt.innerHTML + '<option value="' + arr[i][0] + '">' + arr[i][1]['title'] + '</option>';
		}

	});
}

// default language 
var defValue = "english";

// get the URLSearchParams for the query string
const urlParams = new URLSearchParams(window.location.search);

// get the value of val in the query string
var language = urlParams.get('val');


if (language === null || language === undefined) {
	language = defValue;
}


var languageSettings;

//console.log(languageSettings);

//function to fill in replacement html text using replaceText() function
function fillText() {

	console.log(languageSettings);
	console.log(language);
	$.getJSON(languageSettings[language].view, function (jsonData) {

		console.log(jsonData);

		for (var i = 0; i < jsonData.length; i++) {
			replaceText(jsonData[i].textKeyName, jsonData[i].textValueName);
		}
	});
}



function firstTimeCheck() {
	if (localStorage.getItem("hasCodeRunBefore") === null) {
		$('#firstTime').modal('show');
		localStorage.setItem("clientID", uuidv4());
		localStorage.setItem("hasCodeRunBefore", true);

	}
}

//used for testing purposes
/*function showModal(){
	$('#firstTime').modal('show');
}*/



function onPageLoad() {
	firstTimeCheck();
	//localStorage.setItem ("clientID", uuidv4());
	//showModal();
	populateSelect();
	$.getJSON('languages.json', function (jsonData) {
		languageSettings = jsonData;
		fillText();
		console.log(languageSettings);
	});

	// console.log("my id is "+ uuidv4());


}


$(document).ready(function () { onPageLoad(); });


function consentCheck() {
	localStorage.setItem("consentgiven", "consented");
	var consent = localStorage.getItem("consentgiven");
	console.log("my consent is " + consent);
}

function noConsent() {
	localStorage.setItem("consentgiven", "not consented");
	var consent = localStorage.getItem("consentgiven");
	console.log("my consent is " + consent);
}

function telemetry(event) {
	var consent = localStorage.getItem("consentgiven");
	console.log("my consent is " + consent);

	if (consent == "consented") {
		var appid = "CORDS2021";
		console.log("my app id " + appid);
		var clientid = localStorage.getItem("clientID");
		console.log("client id " + clientid);

		if (event == "calculator") {
			var action = "calculator";
		} else if (event == "viewAboutInfo") {
			var action = "view about information";
		} else if (event == "viewAll") {
			var action = "Viewed complication list";
		} else if (event == "exportExcel") {
			var action = "Exported list to excel";
		} else if (event == "printList") {
			var action = "PDF to print complication list";
		}
		console.log("my event is " + action);

		$.ajax({
			type: "POST",
			url: "http://appdata.dave.qpc.hal.davecutting.uk/record.php",
			data: { appid: appid, clientid: clientid, action: action },
			success: function (res) {
				console.log(res);
			}
		});

	}
}


//changes nav from transparent to color on scroll
$(window).scroll(function () {
	$('nav').toggleClass('scrolled', $(this).scrollTop() > 60);
});


//collapse navbar sm screen on click
$("#navbarSupportedContent a:not(.dropdown-toggle)").click(function () {
	$("#navbarSupportedContent").collapse("hide");
});


//shows hidden form
//$(document).ready(function () {
//	$("#formButton").click(function () {
//		$("#form1").toggle();
//	});
//})



//show hidden view
$(document).ready(function (e) {
	function showView(viewName) {
		$('.view').hide();
		$('#' + viewName).show();
	}
	$('[data-launch-view]').click(function (e) {
		e.preventDefault();
		var viewName = $(this).attr('data-launch-view');
		showView(viewName);
	});
});

//https://stackoverflow.com/questions/48102742/how-to-make-javascript-search-multiple-columns-and-rows-in-a-table/48102942
function mySearch() {
	// Declare vars 
	var input = document.getElementById("myInput");
	var filter = input.value.toUpperCase();
	var table = document.getElementById("compTable");
	var trs = table.tBodies[0].getElementsByTagName("tr");

	// Loop through first tbody's rows
	for (var i = 0; i < trs.length; i++) {

		// define the row's cells
		var tds = trs[i].getElementsByTagName("td");
		trs[i].style.display = "none";

		// loop through row cells and show row if matches
		for (var j = 0; j < tds.length; j++) {
			if (tds[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
				trs[i].style.display = "";

				// go to the next row
				continue;

			}
		}
	}

}// end mySearch()

/*
//https://htmldom.dev/sort-a-table-by-clicking-its-headers/
function sortTable() {
	var rows = $('#mytable tbody  tr').get();
	rows.sort(function (a, b) {
		var A = $(a).children('td').eq(1).text().toUpperCase();
		var B = $(b).children('td').eq(1).text().toUpperCase();

		if (A < B) {
			return -1;
		}
		if (A > B) {
			return 1;
		}
		return 0;
	});
	$.each(rows, function (index, row) {

		$('#mytable').children('tbody').append(row);
	});
}*/




function renderTable(tableType, surgeryType) {
	// clear the div
	const container = document.querySelector('#compTable');
	removeAllChildNodes(container);

	const container2 = document.querySelector('#heading');
	removeAllChildNodes(container2);

	//  Create table
	var table = document.createElement("table");

	// Get table type and calculate button for calculate table   
	if (tableType == "calculator") {


		//Create calculate button
		//https://www.codegrepper.com/code-examples/java/create+a+button+using+javascript
		var calculateButton = document.createElement("button");
		calculateButton.innerHTML = "{{calculate}}";
		calculateButton.className = "replaceText btn btn-submit";
		calculateButton.setAttribute("id", "calculateScore");
		calculateButton.onclick = calcAndCount;

		// Append button
		var body = document.getElementById("tableButtons");
		body.appendChild(calculateButton);


		//headers for calculator table
		$('.filterTable').html('<thead><th>ID</th><th class = "replaceText">{{name}}</th><th class = "replaceText">{{score}}</th><th id = "type" class = "replaceText">{{surgery}}</th><th>eng surgery</th><th class = "replaceText">{{occurrence}}</th><th class = "replaceText">{{severity}}</th><th>eng severity</th><th>Acronym</th><th>English</th></thead><tbody class="filterTableTypeBody"></tbody>');

	} else if (tableType == "displayOnly") {
		//headers for display table
		$(".filterTable").html('<thead><th>ID</th><th class = "replaceText">{{name}}</th><th class = "replaceText">{{score}}</th><th id = "type" class = "replaceText">{{surgery}}</th><th>eng surgery</th><th class = "replaceText">{{occurrence}}</th><th class = "replaceText">{{severity}}</th><th>eng severity</th><th>Acronym</th><th>English</th></thead><tbody class="filterTableTypeBody"></tbody>');

	}  else if (tableType == "displayAll") {
		//headers for display table
		$(".filterTable").html('<thead><th>ID</th><th class = "replaceText">{{name}}</th><th class = "replaceText">{{score}}</th><th id = "type" class = "replaceText">{{surgery}}</th><th>eng surgery</th><th class = "replaceText">{{occurrence}}</th><th class = "replaceText">{{severity}}</th><th>eng severity</th><th>Acronym</th><th>English</th></thead><tbody class="filterTableTypeBody"></tbody>');

	}

	// filter data by surgery type   
	$.getJSON(languageSettings[language].complications, function (jsonData) {
		console.log(jsonData);
		jsonArray = jsonData;

		var surgerySearchTerm = surgeryType;
		var data = jsonArray.filter(jsonObject => jsonObject.surgeryeng.includes(surgerySearchTerm) || jsonObject.surgeryeng.includes("General") || surgerySearchTerm === "all");
		var containers = document.getElementsByClassName("filterTableTypeBody");

		for (var i = 0; i < containers.length; i++) {
			for (var j = 0; j < data.length; j++) {

				var allTableRow = document.createElement("tr");
				var dataId = "comps-" + data[j].ID;
				allTableRow.setAttribute("data-id", dataId);
				allTableRow.className = "comps";

				allTableRow.innerHTML = '<td>' + (j + 1) + '</td> <td>' + data[j].name + '</td> <td data-id="' + dataId + '-score' + '">' + data[j].score + '</td> <td id="type2">' + data[j].surgery + '</td> <td>' + data[j].surgeryeng + '</td> <td>' + data[j].occurrence + '</td> <td>' + data[j].severity + '</td> <td data-id="' + dataId + '-severityeng' + '">' + data[j].severityeng + '</td> <td>' + data[j].acronym + '</td><td>' + data[j].english + '</td>';
				containers[i].appendChild(allTableRow);
				//https://htmldom.dev/sort-a-table-by-clicking-its-headers/
				// Query the table
				const table = document.getElementById('compTable');

				// Query the headers
				const headers = table.querySelectorAll('th');

				// Loop over the headers
				[].forEach.call(headers, function (header, index) {
					header.addEventListener('click', function () {
						// This function will sort the column
						sortColumn(index);
					});
				});


				// Query all rows
				const tableBody = table.querySelector('tbody');
				const rows = tableBody.querySelectorAll('tr');

				const sortColumn = function (index) {
					// Clone the rows
					const newRows = Array.from(rows);

					// Sort rows by the content of cells
					newRows.sort(function (rowA, rowB) {
						// Get the content of cells
						const cellA = rowA.querySelectorAll('td')[index].innerHTML;
						const cellB = rowB.querySelectorAll('td')[index].innerHTML;

						switch (true) {
							case cellA > cellB: return 1;
							case cellA < cellB: return -1;
							case cellA === cellB: return 0;
						}
					});

					// Remove old rows
					[].forEach.call(rows, function (row) {
						tableBody.removeChild(row);
					});

					// Append new row
					newRows.forEach(function (newRow) {
						tableBody.appendChild(newRow);
					});
				};




			}
		}


		// user select comps             
		if (!($(".filterAvdMltpl").hasClass("hrefActive"))) {
			$("#loadingShowScore").addClass("loader");

			$(".comps").click(function () {
				var itemId = $(this).data("id");
				$(this).toggleClass("active");

				let check = $(this).hasClass("active");
				var score = $('td[data-id=' + itemId + '-score]').html();
				var severity = $('td[data-id=' + itemId + '-severityeng]').html();

				if (check) {
					let item = {
						id: itemId,
						score: Number(score),
						severity
					}
					// add item to array
					selection.push(item)

				} else {
					// remove item from array
					for (let i = 0; i < selection.length; ++i) {
						if (selection[i].id == itemId) {
							selection.splice(i, 1);
						}
					}
				}
			});

			$(".filterAvdMltpl").addClass("hrefActive");
			$("#loadingShowScore").removeClass("loader");
		}
		//create page title for each surgery type
		if (surgerySearchTerm == "Scleral Buckle") {
			//Create h1
			var heading = document.createElement("H1");
			heading.innerHTML = "{{sbComps}}<br><br>";
			heading.className = "replaceText";
			// 2. Append H1
			var body = document.getElementById("heading");
			body.appendChild(heading);

		} else if (surgerySearchTerm == "Pars Plana Vitrectomy") {
			//Create h1
			var heading = document.createElement("H1");
			heading.innerHTML = "{{ppvComps}}<br><br>";
			heading.className = "replaceText";
			// 2. Append H1
			var body = document.getElementById("heading");
			body.appendChild(heading);

		} else if (surgerySearchTerm == "Pneumatic Retinopexy") {
			//Create h1
			var heading = document.createElement("H1");
			heading.innerHTML = "{{prComps}}<br><br>";
			heading.className = "replaceText";
			// 2. Append H1
			var body = document.getElementById("heading");
			body.appendChild(heading);
		} else if (surgerySearchTerm === "all") {
			//Create h1
			var heading = document.createElement("H1");
			heading.innerHTML = "<span class= 'replaceText'>{{allComps}}</span> <br><br>";
			heading.className = "replaceText";
			// 2. Append H1
			var body = document.getElementById("heading");
			body.appendChild(heading);
		}

		if (tableType == "calculator") {

			var heading = document.createElement("H2");
			heading.innerHTML = "<br><br>{{pleaseSelect}}";
			heading.className = "replaceText";
			// 2. Append H1
			var body = document.getElementById("heading");
			body.appendChild(heading);

		}

		fillText();
	});

}//end render table function



//get the score values  
function showFinalScore() {

	var scoreVal = 0
	var mildCount = 0
	var moderateCount = 0
	var severeCount = 0

	if (selection.length == 0) {
		scoreVal = "<span class= 'replaceText'>{{select}}</span>";
		var comps = scoreVal;
	} else {
		for (var i = 0; i < selection.length; i++) {
			var item = selection[i]
			scoreVal += item.score

			switch (item.severity) {
				case "Mild":
					mildCount++
					break
				case "Moderate":
					moderateCount++
					break
				case "Severe":
					severeCount++
					break
			}
		}

		var comps = "<span class = 'replaceText'>{{tot}}</span>" + scoreVal
		comps += "<br/><br/> <span class = 'replaceText'>{{mildTot}}</span>" + mildCount
		comps += "<br/> <span class = 'replaceText'>{{modTot}}</span>" + moderateCount
		comps += "<br/> <span class = 'replaceText'>{{severeTot}}</span>" + severeCount

	}

	$("#showTotal").html(comps);
	$("#showTotal").removeClass("hide");

	fillText();

	//scroll to top of page
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

}// end showFinalScore

//https://www.w3schools.com/html/html5_webstorage.asp
function clickCounter() {
	if (typeof (Storage) !== "undefined") {
		if (localStorage.clickcount) {
			localStorage.clickcount = Number(localStorage.clickcount) + 1;
		} else {
			localStorage.clickcount = 1;
		}
		// document.getElementById("result").innerHTML = "You have clicked the button " + localStorage.clickcount + " time(s).";

	} else {
		//document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
	}

	if ((localStorage.clickcount % 25 === 0) || (localStorage.clickcount == 1)) {
		//if (localStorage.clickcount  = 1){
		$('#staticBackdrop').modal('show');
		//localStorage.clickcount = 0;
		console.log(localStorage.clickcount);

	}


}

function calcAndCount() {
	showFinalScore();
	clickCounter();
	telemetry('calculator');
}












