$(document).ready(function () {
    var myWindow = $("#window"),
        undo = $("#undo");

    undo.click(function () {
        myWindow.data("kendoWindow").open();
        undo.fadeOut();
    });

    function onClose() {
        undo.fadeIn();
    }

    myWindow.kendoWindow({
        width: "600px",
        title: "Scheduling tests run",
        visible: false,
        actions: [
            "Close"
        ],
        close: onClose
    }).data("kendoWindow").center().open();

    $("#period").kendoComboBox();
    $("#time").kendoComboBox();

});