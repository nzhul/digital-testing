import './jquery.inlineedit.js';

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

var currentSelectorInput = null;
var testStepTemplate = kendo.template($("#testStepTemplate").html());
var testCaseHeaderTemplate = kendo.template($("#testCaseHeaderTemplate").html());
var testCaseTemplate = kendo.template($("#testCaseTemplate").html());

var testStepActions = [ { text: 'Click', value: 'click' }, { text: 'Fill', value: 'fill' }, { text: 'Hover', value: 'hover' }, { text: 'Wait for', value: 'wait-for' }];
var actionsWithValues = [ testStepActions[1].value ];

var emptyTestStep = {
    inputSelector: '',
    actions: testStepActions,
    selectedAction: 'fill',
    actionValue: ''
};

var tests = [
    {
        name: 'Form Test',
        steps: [
            {
                inputSelector: '#GeneralContent_C007_ctl00_ctl00_C001_ctl00_ctl00_textBox_write',
                actions: testStepActions,
                selectedAction: 'fill',
                actionValue: 'kristian.kirov@progress.com'
            },
            {
                inputSelector: '#GeneralContent_C007_ctl00_ctl00_C003_ctl00_ctl00_textBox_write',
                actions: testStepActions,
                selectedAction: 'fill',
                actionValue: 'Kristian'
            },
            {
                inputSelector: '#GeneralContent_C007_ctl00_ctl00_C004_ctl00_ctl00_textBox_write',
                actions: testStepActions,
                selectedAction: 'fill',
                actionValue: 'Kirov'
            },
            {
                inputSelector: '#GeneralContent_C007_ctl00_ctl00_C006_ctl00_ctl00_textBox_write',
                actions: testStepActions,
                selectedAction: 'fill',
                actionValue: 'Progress'
            },
            {
                inputSelector: '#GeneralContent_C007_ctl00_ctl00_C002',
                actions: testStepActions,
                selectedAction: 'click',
                actionValue: ''
            }
        ]
    }
];

eventer(messageEvent, function (e) {
    var receivedMessage = e.data;
    if ((receivedMessage.type === 'highlight' && currentSelectorInput !== null) || receivedMessage.type === 'force-highlight') {
        $("#highlighter").css({
            'top': receivedMessage.t + 'px',
            'left': receivedMessage.l + 'px',
            'width': receivedMessage.w + 'px',
            'height': receivedMessage.h + 'px'
        });
    }
    else if (receivedMessage.type === 'selected-element') {
        if (receivedMessage.selector && currentSelectorInput !== null) {
            currentSelectorInput.value = receivedMessage.selector;
            currentSelectorInput = null;
            hideHighlighter();
        }
    }
}, false);

// $('#selectBtn').click(function () {
    
// });

function hoverElement(selector) {
    var siteFrame = $('#site-content iframe').get(0);
    siteFrame.contentWindow.postMessage({
        type: 'trigger-highlight',
        selector: selector
    }, '*');
}

var testsPanelBar = $("#testPanel").kendoPanelBar().data("kendoPanelBar");


function selectorInputHandler() {
    currentSelectorInput = null;
    var selector = $(this).val();
    if (selector) {
        hoverElement(selector);
    }
}

function hideHighlighter() {
    $("#highlighter").css({
            'top': '-10px',
            'left': '-10px',
            'width': '0',
            'height': '0'
        });
}

function setValueVisibility(actionInput) {
    var selectedAction = actionInput.val();
    var valueStepItem = actionInput.parents(".test-step-item").next('.value-step-item');
    if (actionsWithValues.indexOf(selectedAction) != -1) {
        valueStepItem.show();
    }
    else {
        valueStepItem.hide();
    }
}

function initializeTestStep(testStepDomItem) {
    testStepDomItem.find(".selector-input").on('focusin keyup mouseup', selectorInputHandler);
    testStepDomItem.find(".selector-input").on('focusout', hideHighlighter);

    testStepDomItem.find('.selector-input + a').click(function () {
        var selectorToFill = $(this).prev().get(0);
        if (selectorToFill === currentSelectorInput) {
            currentSelectorInput = null;
            hideHighlighter();
        }
        else {
            currentSelectorInput = selectorToFill;
        } 
    });

    testStepDomItem.find('.action-input').change(function() {
        setValueVisibility($(this));
    }).each(function() {
        setValueVisibility($(this));
    });

    testStepDomItem.find('.test-step-controls .add-control').click(function() {
        var newTestStepDomItem = createTestStepUi(emptyTestStep);
        $(this).parents('.test-step').after(newTestStepDomItem);
    });

    testStepDomItem.find('.test-step-controls .remove-control').click(function() {
        $(this).parents('.test-step').remove();
    });
}

function createTestStepUi(stepData) {
    var testStepMarkup = testStepTemplate(stepData);
    var testStepDomItem = $(testStepMarkup);
    initializeTestStep(testStepDomItem);

    return testStepDomItem;
}

function createTestCase(name) {
    var testCaseHeaderMarkup = testCaseHeaderTemplate({ name: name });
    var testCaseTemplateMarkup = testCaseTemplate({ });

    testsPanelBar.append({
        text: testCaseHeaderMarkup,
        encoded: false,
        content: testCaseTemplateMarkup
    });

    var createdPanel = testsPanelBar.element.children("li:last").last();
    createdPanel.find('.editable').inlineEdit({
        buttons: '<a href="#" class="save inline-edit-action"><i class="fa fa-check" aria-hidden="true"></i></a> <a href="#" class="cancel inline-edit-action"><i class="fa fa-times"></i></a>',
        buttonsTag: 'a'
    });

    var suitesSelector = createdPanel.find('.suites-selector').select2({
        tags: true,
        tokenSeparators: [',']
    }).data('select2');
    suitesSelector.$container.removeAttr("style");

    return createdPanel;
}

function createFullTestCase(testCaseDefinition) {
    var testDomItem = createTestCase(testCaseDefinition.name);
    var testStepsDomItem = testDomItem.find('.test-case-steps');

    for (var i = 0; i < testCaseDefinition.steps.length; i++) {
        var currentTestStep = testCaseDefinition.steps[i];
        var testStepDomItem = createTestStepUi(currentTestStep);
        testStepsDomItem.append(testStepDomItem);
    }
}

for (var j = 0; j < tests.length; j++) {
    var currentTest = tests[j];
    createFullTestCase(currentTest);
}

$('#addTestCaseBtn').click(function () {
    createFullTestCase({
        name: 'New Test',
        steps: [
            emptyTestStep
        ]
    });
});