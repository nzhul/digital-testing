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
    width: "650px",
    maxWidth: "650px",
    title: "Scheduling tests run",
    visible: false,
    actions: [
        "Close"
    ],
    close: onClose
}).data("kendoWindow").center().open();



//$("#period").kendoComboBox();
//$("#time").kendoComboBox();

$("#period").kendoComboBox({
    dataTextField: "periodName",
    dataValueField: "periodId",
    placeholder:"Every",
    clearButton: false,
    dataSource: [
        { periodName: "Day", periodId: 1 },
        { periodName: "Month", periodId: 2 }
    ]
});

$("#time").kendoComboBox({
    cascadeFrom: "period",
    cascadeFromField: "parentId",
    dataTextField: "timeName",
    placeholder:"at/on",
    clearButton: false,
    dataValueField: "timeId",
    dataSource: [
        { timeName: "1am", timeId: 1, parentId: 1 },
        { timeName: "2am", timeId: 2, parentId: 1 },
        { timeName: "3am", timeId: 3, parentId: 1 },
        { timeName: "4am", timeId: 4, parentId: 1 },
        { timeName: "5am", timeId: 5, parentId: 1 },
        { timeName: "6am", timeId: 6, parentId: 1 },
        { timeName: "7am", timeId: 7, parentId: 1 },
        { timeName: "8am", timeId: 8, parentId: 1 },
        { timeName: "9am", timeId: 9, parentId: 1 },
        { timeName: "10am", timeId: 10, parentId: 1 },
        { timeName: "11am", timeId: 11, parentId: 1 },
        { timeName: "12am", timeId: 12, parentId: 1 },
        { timeName: "1pm", timeId: 13, parentId: 1 },
        { timeName: "2pm", timeId: 14, parentId: 1 },
        { timeName: "3pm", timeId: 15, parentId: 1 },
        { timeName: "4pm", timeId: 16, parentId: 1 },
        { timeName: "5pm", timeId: 17, parentId: 1 },
        { timeName: "6pm", timeId: 18, parentId: 1 },
        { timeName: "7pm", timeId: 19, parentId: 1 },
        { timeName: "8pm", timeId: 20, parentId: 1 },
        { timeName: "9pm", timeId: 21, parentId: 1 },
        { timeName: "10pm", timeId: 22, parentId: 1 },
        { timeName: "11pm", timeId: 23, parentId: 1 },
        { timeName: "12pm", timeId: 24, parentId: 1 },
        { timeName: "1th", timeId: 1, parentId: 2 },
        { timeName: "2th", timeId: 2, parentId: 2 },
        { timeName: "3th", timeId: 3, parentId: 2 },
        { timeName: "4th", timeId: 4, parentId: 2 },
        { timeName: "5th", timeId: 5, parentId: 2 },
        { timeName: "6th", timeId: 6, parentId: 2 },
        { timeName: "7th", timeId: 7, parentId: 2 },
        { timeName: "8th", timeId: 8, parentId: 2 },
        { timeName: "9th", timeId: 9, parentId: 2 },
        { timeName: "10th", timeId: 10, parentId: 2 },
        { timeName: "11th", timeId: 11, parentId: 2 },
        { timeName: "12th", timeId: 12, parentId: 2 },
        { timeName: "13th", timeId: 13, parentId: 2 },
        { timeName: "14th", timeId: 14, parentId: 2 },
        { timeName: "15th", timeId: 15, parentId: 2 },
        { timeName: "16th", timeId: 16, parentId: 2 },
        { timeName: "17th", timeId: 17, parentId: 2 },
        { timeName: "18th", timeId: 18, parentId: 2 },
        { timeName: "19th", timeId: 19, parentId: 2 },
        { timeName: "20th", timeId: 20, parentId: 2 },
        { timeName: "21th", timeId: 21, parentId: 2 },
        { timeName: "22th", timeId: 22, parentId: 2 },
        { timeName: "23th", timeId: 23, parentId: 2 },
        { timeName: "24th", timeId: 24, parentId: 2 },
        { timeName: "25th", timeId: 17, parentId: 2 },
        { timeName: "26th", timeId: 18, parentId: 2 },
        { timeName: "27th", timeId: 19, parentId: 2 },
        { timeName: "28th", timeId: 20, parentId: 2 },
        { timeName: "29th", timeId: 21, parentId: 2 },
        { timeName: "30th", timeId: 22, parentId: 2 },
        { timeName: "31th", timeId: 23, parentId: 2 }
    ]
});

$("#time2").kendoComboBox({
    cascadeFrom: "period",
    cascadeFromField: "parentId",
    dataTextField: "timeName",
    placeholder:"at",
    clearButton: false,
    dataValueField: "timeId",
    dataSource: [
        { timeName: "1am", timeId: 1, parentId: 2 },
        { timeName: "2am", timeId: 2, parentId: 2 },
        { timeName: "3am", timeId: 3, parentId: 2 },
        { timeName: "4am", timeId: 4, parentId: 2 },
        { timeName: "5am", timeId: 5, parentId: 2 },
        { timeName: "6am", timeId: 6, parentId: 2 },
        { timeName: "7am", timeId: 7, parentId: 2 },
        { timeName: "8am", timeId: 8, parentId: 2 },
        { timeName: "9am", timeId: 9, parentId: 2 },
        { timeName: "10am", timeId: 10, parentId: 2 },
        { timeName: "11am", timeId: 11, parentId: 2 },
        { timeName: "12am", timeId: 12, parentId: 2 },
        { timeName: "1pm", timeId: 13, parentId: 2 },
        { timeName: "2pm", timeId: 14, parentId: 2 },
        { timeName: "3pm", timeId: 15, parentId: 2 },
        { timeName: "4pm", timeId: 16, parentId: 2 },
        { timeName: "5pm", timeId: 17, parentId: 2 },
        { timeName: "6pm", timeId: 18, parentId: 2 },
        { timeName: "7pm", timeId: 19, parentId: 2 },
        { timeName: "8pm", timeId: 20, parentId: 2 },
        { timeName: "9pm", timeId: 21, parentId: 2 }
    ]
});

var period = $("#period").data("kendoComboBox");
var time = $("#time").data("kendoComboBox");
var time2 = $("#time2").data("kendoComboBox");
time2.wrapper.hide();

period.bind("change", period_change);

function period_change(e) {
    if (e.sender._old == 2) {
        time2.wrapper.show();
    } else {
        time2.wrapper.hide();
    }
}