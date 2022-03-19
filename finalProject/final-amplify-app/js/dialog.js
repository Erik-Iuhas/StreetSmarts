$(document).ready(function () {
	
	$('#obstr').click(function() {
		$('#dialog').dialog("open");
	});
	
	$('#dialog').dialog({
		title: "Report Obstruction",
		closeText: "X",
		autoOpen: false
	});
	
})