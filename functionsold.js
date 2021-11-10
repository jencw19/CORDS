
let selection = []

//




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



/*function engDefault(val) {
	$.getJSON('english.json', function (jsonData) {
		for (var i = 0; i < jsonData.length; i++) {
			replaceText(jsonData[i].textKeyName, jsonData[i].textValueName);
		}
	});
}*/






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

// this is the default value to be used if no val parameter is provided
var defValue = "english";

// get the URLSearchParams for the query string
const urlParams = new URLSearchParams(window.location.search);

// get the value of val in the query string
var language = urlParams.get('val');


if (language === null || language === undefined) {
	language = defValue;
}
//language === null || language === undefined ? defValue : language;
//console.log(language);

//document.write("The value of val we will use is: "+val);
var languageSettings;

//console.log(languageSettings);

//function to fill in replacement html text using replaceText() function
function fillText() {
	// get json? do need to if have already got above? 
	console.log(languageSettings);
	console.log(language);
	$.getJSON(languageSettings[language].view, function (jsonData) {  //needs replaced by whatever view should be passed in

		console.log(jsonData);

		for (var i = 0; i < jsonData.length; i++) {
			replaceText(jsonData[i].textKeyName, jsonData[i].textValueName);
		}
	});
}

/*function fillTableText() {
	// get json? do need to if have already got above? 
	console.log(languageSettings);
	console.log(language);
	$.getJSON(languageSettings[language].complications , function (jsonData) {  //needs replaced by whatever view should be passed in
		
		console.log(jsonData);

		for (var i = 0; i < jsonData.length; i++) {
			replaceText(jsonData[i].textKeyName, jsonData[i].textValueName);
		}
	});
}*/

/*function engDefault() {
	$.getJSON('english.json', function (jsonData) {
		for (var i = 0; i < jsonData.length; i++) {
			replaceText(jsonData[i].textKeyName, jsonData[i].textValueName);
		}
	});
}*/

function onPageLoad() {
	// sets up english as default view
	//engDefault();
	populateSelect();
	$.getJSON('languages.json', function (jsonData) {
		languageSettings = jsonData;
		fillText();
		console.log(languageSettings);
	});


}


window.onload = onPageLoad();







//changes nav from transparent to color on scroll
$(window).scroll(function () {
	$('nav').toggleClass('scrolled', $(this).scrollTop() > 60);
});


//collapse navbar sm screen on click
$("#navbarSupportedContent a:not(.dropdown-toggle)").click(function () {
	$("#navbarSupportedContent").collapse("hide");
});


//shows hidden form
$(document).ready(function () {
	$("#formButton").click(function () {
		$("#form1").toggle();
	});
})



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


function mySearch() {
	// Declare variables 
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

}





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
		var calculateButton = document.createElement("button");
		calculateButton.innerHTML = "{{calculate}}";
		calculateButton.className = "replaceText btn btn-submit";
		calculateButton.setAttribute("id", "calculateScore");
		calculateButton.onclick = calcAndCount;

		// Append button
		var body = document.getElementById("tableButtons");
		body.appendChild(calculateButton);


		//headers for calculator table
		$('.filterTable').html('<thead><th>ID</th><th class = "replaceText">{{name}}</th><th class = "replaceText">{{score}}</th><th class = "replaceText">{{surgery}}</th><th>eng surgery</th><th class = "replaceText">{{occurrence}}</th><th class = "replaceText">{{severity}}</th><th>eng severity</th><th>Acronym</th><th>English</th></thead><tbody class="filterTableTypeBody"></tbody>');

	} else if (tableType == "displayOnly") {
		//headers for display table
		$(".filterTable").html('<thead><th>ID</th><th class = "replaceText">{{name}}</th><th class = "replaceText">{{score}}</th><th class = "replaceText">{{surgery}}</th><th>eng surgery</th><th class = "replaceText">{{occurrence}}</th><th class = "replaceText">{{severity}}</th><th>eng severity</th><th>Acronym</th><th>English</th></thead><tbody class="filterTableTypeBody"></tbody>');

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

				allTableRow.innerHTML = '<td>' + (j + 1) + '</td> <td>' + data[j].name + '</td> <td data-id="' + dataId + '-score' + '">' + data[j].score + '</td> <td>' + data[j].surgery + '</td> <td>' + data[j].surgeryeng + '</td> <td>' + data[j].occurrence + '</td> <td>' + data[j].severity + '</td> <td data-id="' + dataId + '-severityeng' + '">' + data[j].severityeng + '</td> <td>' + data[j].acronym + '</td><td>' + data[j].english + '</td>';
				containers[i].appendChild(allTableRow);

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
			localStorage.clickcount = 0;
		}
		//document.getElementById("result").innerHTML = "You have clicked the button " + localStorage.clickcount + " time(s).";

	} else {
		//document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
	}

	if (localStorage.clickcount % 3 === 0) {
		$('#staticBackdrop').modal('show');
		localStorage.clickcount = 0;

	}


}

function calcAndCount() {
	showFinalScore();
	clickCounter();
}

/*function hideSurgeryColumn(){
	document.getElementById("type").style.display= 'none';
	document.getElementById("type2").style.display = 'none';
}*/

