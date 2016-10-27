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

	$("#panelbar").kendoPanelBar({
		expandMode: "single"
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
				window.location = "/testbuilder?urlname=" + urlName;
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
});
