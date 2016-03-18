	var uniqueUsers = new Array();
	var scores = new Array();
	var database = new Array();

	$.post('connection.php?request=' + "details", function(data,status) {localizeDB(data, status)});

	function localizeDB(data, status) {
		database = JSON.parse(data);
		uniqueUsers = getNames();	
		scores = getScores();
		populateLayout();
	}

	function populateLayout() {
		var table_users = document.createElement("table");
		table_users.setAttribute("id", "table_users");
		table_users.setAttribute("style", "width:100%; text-align:center; color:#428bca font-family:Roboto, Calibri, sans-serif; border-spacing:1em");

		var tr_header = document.createElement("tr");
		tr_header.setAttribute("id", "header");
		tr_header.setAttribute("style", "font-weight:bold");

		var td_header_user = document.createElement("td");
		var td_header_score = document.createElement("td");
		var td_header_button = document.createElement("td");

		var label_header_user = document.createTextNode("Name");
		var label_header_score = document.createTextNode("Score");
		var label_header_button = document.createTextNode("Button");

		td_header_user.appendChild(label_header_user);
		td_header_score.appendChild(label_header_score);
		td_header_button.appendChild(label_header_button);

		tr_header.appendChild(td_header_user);
		tr_header.appendChild(td_header_score);
		tr_header.appendChild(td_header_button);

		table_users.appendChild(tr_header);

		for (j = 0; j < uniqueUsers.length; j++) {
			name = uniqueUsers[j];

			var tr_user = document.createElement("tr");
			tr_user.setAttribute("id", name + "_row");
			tr_user.setAttribute("style", "width:100%; height:auto;");

			var td_user_name = document.createElement("td");
			var td_user_score = document.createElement("td");
			var td_user_button = document.createElement("td");
			td_user_name.setAttribute("id", name + "_name_td");
			td_user_score.setAttribute("id", name + "_score_td");
			td_user_button.setAttribute("id", name + "_button_td");

			var div_user_name = document.createElement("div");
			var div_user_score = document.createElement("div");
			var div_user_button = document.createElement("div");
			div_user_name.setAttribute("id", name + "_div_name");
			div_user_score.setAttribute("id", name + "_div_score");
			div_user_button.setAttribute("id", name + "_button_div");

			var label_user_button = document.createElement("p");
			label_user_button.appendChild(document.createTextNode("+1 Game"));
			label_user_button.setAttribute("style", "color:white");
			var button_user = document.createElement("button");
			button_user.setAttribute("id", name + "_button");
			button_user.onclick = function() {
				userToGiveAWin = this.getAttribute("id").split("_")[0];
				plusOne(userToGiveAWin);
			}
			div_user_score.onclick = function() {
				modal(this.innerHTML, this.parentElement.innerHTML, this.parentElement.parentElement);
			}

			tr_user.appendChild(td_user_name);
			tr_user.appendChild(td_user_score);
			tr_user.appendChild(td_user_button);

			td_user_name.appendChild(div_user_name);
			td_user_score.appendChild(div_user_score);
			td_user_button.appendChild(div_user_button);

			div_user_name.appendChild(document.createTextNode(name)); 			
			div_user_score.innerHTML = scores[j];
			div_user_button.appendChild(button_user);
			button_user.appendChild(label_user_button);

			table_users.appendChild(tr_user);
		}
		document.getElementById("dynamicUsersTable").appendChild(table_users);
	}

	function plusOne(person) {
		var operation = "addPoints"
		$.post('connection.php?request=' + operation + '&user=' + person, function(data,status){addPointsCallback(data, status)});
	}

	function addPointsCallback(data, status){
		refreshScore(data);
	}

	function refreshScore(user) {
		console.log(user);
		for (j = 0; j < uniqueUsers.length; j++) {
			if (capitalizeFirstLetter(user) == capitalizeFirstLetter(uniqueUsers[j])) {
				scores[j]++;
				original_div_user_score = document.getElementById(user + "_div_score");
				original_div_user_score.innerHTML = scores[j];
			}
		}
	}

	function modal(score, userInnerHTML, userRow) {
		userForModal = decapitalizeFirstLetter(userRow.id.split("_")[0]);

		listTable = $("#listTable").empty();
		for (j = database.length-1; j > 0; j--) {
			if (decapitalizeFirstLetter(database[j].user) == userForModal) {	
				tr = document.createElement("tr");
				td_id = document.createElement("td");
				td_details = document.createElement("td");
				td_timestamps = document.createElement("td");
				/////
				editText_details = document.createElement("textarea");
				editText_details.value = database[j].details;
				editText_details.setAttribute("style", "width:100%");
				editText_details.setAttribute("id", "textArea_" + database[j].id + "_" + j)
				td_details.appendChild(editText_details);
				//Set up Listeners for DETAILS updates by the user
				editText_details.addEventListener('focusout',function(e){
					sqlID = this.getAttribute("id").split("_")[1];
					jID = this.getAttribute("id").split("_")[2];
					currentText = database[jID].details;
					newText = this.value;
					if (currentText != newText) {
						updateOneDetail(currentText, newText, jID, sqlID);
					} else {
					}
				}, true);

				td_id.appendChild(document.createTextNode(database[j].id));
				td_timestamps.appendChild(document.createTextNode(database[j].ts));
				
				tr.appendChild(td_timestamps);
				tr.appendChild(td_id);
				tr.appendChild(td_details);

				tr.setAttribute("id", "tr_" + j);
				tr.setAttribute("class", "tr");
				td_id.setAttribute("id", "td_id_" + j);
				td_details.setAttribute("id", "td_details_" + j);
				td_timestamps.setAttribute("id", "td_timestamps_" + j);
				td_id.setAttribute("class", "dialog-TD");
				td_details.setAttribute("class", "dialog-TD");
				td_timestamps.setAttribute("class", "dialog-TD");
				listTable.append(tr);
			}
		}

		$("#dialog").dialog({
			autoOpen: false,
			modal: true,
			width: $(document).width()*.75,
			maxHeight: $(window).height()*.75,
			title: capitalizeFirstLetter(userForModal) + "'s Score History",
			//focus: $("#focusCatch"),
			//show: {
				//effect: "scale",
				//duration: 250
			//},
			//hide: {
				//effect: "puff",
				//duration: 250,
			//}
		});
	//Open it when #opener is clicked
	//$("#opener").click(function () {
		$("#dialog").dialog("open");
	//});
	//When the button in the form is clicked, take the input value and set that as the value of `.myTarget`
	$('.formSaver').on('click', function () {
	    //$('.myTarget').text($('.myInput').val());
	    $("#dialog").dialog('close');	    
	});
}

function updateOneDetail(currentText, newText, jID, sqlID) {
	console.log("Updating database entry #" + sqlID + " with the new text value of: " + newText + ". The old value was: " + currentText);
	$.post('connection.php?request=' + "updateDetails&id=" + sqlID
		+ "&newDetails=" + newText, function(data,status) {updateDetails(newText, jID, data, status)});
}

function updateDetails(newText, jID, data, status) {
	if (status == "success") {
		console.log("Updated details");
		database[jID].details = newText;
	} else {
		console.error("Update of details failed.");
		console.log(data + " \n" + status);
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function decapitalizeFirstLetter(string) {
	return string.charAt(0).toLowerCase() + string.slice(1);
}

function getNames() {
	for (j = 0; j < database.length; j++) {
		uniqueUsers[j] = capitalizeFirstLetter(database[j].user);
	}

	uniqueUsers = unique(uniqueUsers);
	return uniqueUsers;
}

function getScores() {
	for (j = 0; j < uniqueUsers.length; j++) {
		scores[j] = 0;
	}

	for (j = 0; j < uniqueUsers.length; j++) {
		for (k = 0; k < database.length; k++) {
			if (capitalizeFirstLetter(uniqueUsers[j]) == capitalizeFirstLetter(database[k].user)) {
				scores[j]++;
			}
		}

	}
	return scores;
}

function unique(list) {
	var result = [];
	$.each(list, function(i, e) {
		if ($.inArray(e, result) == -1) result.push(e);
	});
	return result;
}