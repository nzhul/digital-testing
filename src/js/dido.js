﻿import progress from './setup-env-form'

$(document).ready(function () {
  'use strict'
  if (!document.querySelector('#tabstrip')) return

	$("#tabstrip").kendoTabStrip({
		animation: {
			open: {
				effects: "fadeIn"
			}
		}
	});

	$("#panelbar, #panelbar-2").kendoPanelBar({
		expandMode: "multiple"
	});

	$('#loading-box').hide();
	$('.layout-container').show();

	var myWindow = $("#add-new-test-dialog"),
	schedulingBtn = $(".add-new-test-btn");

	schedulingBtn.click(function () {
		myWindow.data("kendoWindow").open();
		//schedulingBtn.fadeOut();
	});

	function onClose() {
		//schedulingBtn.fadeIn();
	}

	myWindow.kendoWindow({
		width: "650px",
		height: "150px;",
		title: "Add new test:",
		visible: false,
		modal: true,
		actions: [
			"Maximize",
			"Close"
		],
		close: onClose
	}).data("kendoWindow").center();

		var data = [
			'webinars',
			'papers',
			'services/education/register',
			'account/login',
			'company/products',
			'kendo-ui/window',
			'kendo-ui/grid',
			'devcraft',
			'products/corticon',
			'products/openedge',
			'products/interfaces/jdbc',
			'products/interfaces/odbc'
		];

		//create AutoComplete UI component
		$("#pages").kendoAutoComplete({
			dataSource: data,
			filter: "contains",
			placeholder: "select page",
			separator: ""
		});

		$('.js-add-test-btn').on('click', function () {
			var urlName = $('#pages').val();
			if (urlName) {
				window.location = "/test-builder?urlname=" + urlName;
			}
		});


	// upload modal start

	var uploadWindow = $("#upload-package-dialog"),
	schedulingBtn = $(".upload-package-button");

		schedulingBtn.click(function () {
			uploadWindow.data("kendoWindow").open();
			//schedulingBtn.hide();
		});

		function onClose() {
			//schedulingBtn.show();
		}

	uploadWindow.kendoWindow({
			width: "650px",
			height: "150px;",
			title: "Upload package",
			visible: false,
			modal: true,
			actions: [
				"Maximize",
				"Close"
			],
			close: onClose
	}).data("kendoWindow").center();


	// Upload fake
	$('.js-upload-btn').on('click', function () {
		uploadWindow.data('kendoWindow').close();
		$('#teststudio-upload-wrapper').hide();
		$('#teststudio-upload-fake-loading').slideToggle('fast'); // show polimer fancy loading
		progress
			.start(document.querySelector('#js-analize-bar'), 1)
			.then(() => progress.start(document.querySelector('#js-analize-bar2'), 2))
			.then(() => {
				$('#teststudio-upload-fake-loading').slideToggle('fast')
				$('#teststudio-upload-result').slideToggle('fast')
			})
	});
});

