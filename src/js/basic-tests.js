import './jquery.inlineedit.js';

(function () {
    'use strict'
    if ($("#testStepTemplate").length == 0) {
        return;
    }

    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    var currentSelectorInput = null;
    var testStepTemplate = kendo.template($("#testStepTemplate").html());
    var testCaseHeaderTemplate = kendo.template($("#testCaseHeaderTemplate").html());
    var testCaseTemplate = kendo.template($("#testCaseTemplate").html());
    var testAssertTemplate = kendo.template($("#testAssertTemplate").html());

    var testStepActions = [{ text: 'Click', value: 'click' }, { text: 'Fill', value: 'fill' }, { text: 'Hover', value: 'hover' }, { text: 'Wait for', value: 'wait-for' }];
    var actionsWithValues = [testStepActions[1].value];

    var emptyTestStep = {
        inputSelector: '',
        actions: testStepActions,
        selectedAction: 'fill',
        actionValue: ''
    };

    var emptyAssert = {
        object: 'element',
        operation: 'exist',
        value: '',
        elementSelector: ''
    }

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
            ],
            assertions: [
                {
                    object: 'url-path',
                    operation: 'equals',
                    value: '/services/education/register-thank-you',
                    elementSelector: ''
                },
                {
                    object: 'element',
                    operation: 'visible',
                    value: '',
                    elementSelector: 'h1'
                },
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

    function initializeSelectorInputs(wrapper) {
        wrapper.find(".selector-input")
            .on('focusin keyup mouseup', selectorInputHandler)
            .on('focusout', hideHighlighter);

        wrapper.find('.selector-input + a').click(function () {
            var selectorToFill = $(this).prev().get(0);
            if (selectorToFill === currentSelectorInput) {
                currentSelectorInput = null;
                hideHighlighter();
            }
            else {
                currentSelectorInput = selectorToFill;
            }
        });
    }

    function initializeControls(wrapper, domItemFactory) {
        wrapper.find('.test-step-controls .add-control').click(function () {
            var newTestStepDomItem = domItemFactory();
            $(this).parents('.test-step').after(newTestStepDomItem);
        });

        wrapper.find('.test-step-controls .remove-control').click(function () {
            $(this).parents('.test-step').remove();
        });
    }

    function initializeTestStep(testStepDomItem) {
        initializeSelectorInputs(testStepDomItem);

        testStepDomItem.find('.action-input').change(function () {
            setValueVisibility($(this));
        }).each(function () {
            setValueVisibility($(this));
        });

        initializeControls(testStepDomItem, function () {
            return createTestStepUi(emptyTestStep);
        });
    }

    function createTestStepUi(stepData) {
        var testStepMarkup = testStepTemplate(stepData);
        var testStepDomItem = $(testStepMarkup);
        initializeTestStep(testStepDomItem);

        return testStepDomItem;
    }

    function setAssertOptionsVisibility(assertObjectSelector) {
        var assertObject = assertObjectSelector.val();
        var assertOptionsPanel = assertObjectSelector.parents(".test-step");
        assertOptionsPanel.find('.assert-object-config').hide();
        assertOptionsPanel.find('.' + assertObject).show();
    }

    function initializeTestAssertionUi(testAssertionDomItem) {
        initializeSelectorInputs(testAssertionDomItem);

        testAssertionDomItem.find('.assert-object-selector').change(function () {
            setAssertOptionsVisibility($(this));
        }).each(function () {
            setAssertOptionsVisibility($(this));
        });

        initializeControls(testAssertionDomItem, function () {
            return createTestAssertionUi(emptyAssert);
        });
    }

    function createTestAssertionUi(assertionData) {
        var testAssertionMarkup = testAssertTemplate(assertionData);
        var testAssertionDomItem = $(testAssertionMarkup);
        initializeTestAssertionUi(testAssertionDomItem);

        return testAssertionDomItem;
    }

    function createTestCase(name) {
        var testCaseHeaderMarkup = testCaseHeaderTemplate({ name: name });
        var testCaseTemplateMarkup = testCaseTemplate({});

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

        createdPanel.find('.save-button').click(function () {
            var currentPanel = $(this).parents("li[role=menuitem]");
            testsPanelBar.collapse(createdPanel)
        });

        return createdPanel;
    }

    function createFullTestCase(testCaseDefinition) {
        var testDomItem = createTestCase(testCaseDefinition.name);
        var testStepsDomItem = testDomItem.find('.test-case-steps');
        var testAssertionsDomItem = testDomItem.find('.test-case-asserts');

        for (var i = 0; i < testCaseDefinition.steps.length; i++) {
            var currentTestStep = testCaseDefinition.steps[i];
            var testStepDomItem = createTestStepUi(currentTestStep);
            testStepsDomItem.append(testStepDomItem);
        }

        for (var j = 0; j < testCaseDefinition.assertions.length; j++) {
            var currentTestAssertion = testCaseDefinition.assertions[j];
            var testAssertionDomItem = createTestAssertionUi(currentTestAssertion);
            testAssertionsDomItem.append(testAssertionDomItem);
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
            ],
            assertions: [
                emptyAssert
            ]
        });
    });
})();