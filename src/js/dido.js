$(document).ready(function () {
	$("#tabstrip").kendoTabStrip({
		animation: {
			open: {
				effects: "fadeIn"
			}
		}
	});
});

$(document).ready(function () {
	$("#panelbar").kendoPanelBar({
		expandMode: "single"
	});
});

$(document).ready(function () {
	$('#loading-box').hide();
	$('.layout-container').show();
})

$(document).ready(function () {
	$('.scheduling-button').on('click', function () {
		alert('sheduling');
	})
});