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
	$('.scheduling-button').on('click', function (even) {
		event.preventDefault();
		event.stopPropagation();
		alert('show scheduling dialog here');
	});
});

$(document).ready(function () {
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
			"Pin",
			"Minimize",
			"Maximize",
			"Close"
		],
		close: onClose
	}).data("kendoWindow").center();
});

	$(document).ready(function () {
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
	});