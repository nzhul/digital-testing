$(document).ready(function () {
	'use strict'
	if (!document.querySelector('#pageid-details')) return

	$('#loading-box').hide();
	$('.layout-container').show();

	// screenshot modal
	var screenshotDialog = $("#screehshot-dialog"),
	screenshotBtn = $("#screenshot-btn");

	screenshotBtn.click(function () {
		screenshotDialog.data("kendoWindow").open();
	});

	screenshotDialog.kendoWindow({
		width: "80%",
		height: "80%",
		title: "Screenshots:",
		visible: false,
		modal: true,
		actions: [
			"Maximize",
			"Close"
		]
	}).data("kendoWindow").center();

	// Video modal
	var videoDialog = $("#video-dialog"),
	videoBtn = $("#video-btn");

	videoBtn.click(function () {
		videoDialog.data("kendoWindow").open();
	});

	videoDialog.kendoWindow({
		width: "760px",
		height: "435px",
		title: "Video:",
		visible: false,
		modal: true,
		actions: [
			"Maximize",
			"Close"
		]
	}).data("kendoWindow").center();
});