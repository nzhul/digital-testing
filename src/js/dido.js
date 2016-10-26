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