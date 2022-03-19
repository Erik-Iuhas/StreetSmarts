var hideTextBox
var obstructionsType

//need to wait for the html to finish loading before applying handlers
window.onload = function(){
	
	obstructionsType = document.getElementById("obstructions");
	
	hideTextBox = document.getElementById("otherBox");
	//hideTextBox.style.visibility = "hidden";
	hideTextBox.style.display = "none";
	
	obstructionsType.addEventListener("change", obstruction);
}

function obstruction(){
	if (obstructionsType.options[obstructionsType.selectedIndex].value == "other") {
		//hideTextBox.style.visibility = "visible";
		hideTextBox.style.display = "inline";
	}
	else {
		//hideTextBox.style.visibility = "hidden";
		hideTextBox.style.display = "none";
	}
}