import CssSelectorGenerator from './css-selector-generator.min.js'

var elementSelectorGenerator = new CssSelectorGenerator();

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }

    return { top: _y, left: _x };
}

window.addEventListener('mouseover', function(e) {
    var targetElement = e.target;
    hoverElement(targetElement);
});

window.addEventListener('click', function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        var targetElement = e.target;
        
        var generatedSelector = elementSelectorGenerator.getSelector(targetElement);
        sendSelectedElement(generatedSelector);
    }
});

function hoverElement(el, force) {
    var absoluteOffset = getOffset(el);

    parent.postMessage({
        type: force ? "force-highlight" : "highlight",
        w: el.offsetWidth,
        h: el.offsetHeight,
        t: absoluteOffset.top,
        l: absoluteOffset.left
    }, "*");
}

function sendSelectedElement(elementSelector) {
    parent.postMessage({
        type: "selected-element",
        selector: elementSelector
    }, "*");
}

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

eventer(messageEvent, function(e) {
    var receivedMessage = e.data; 
    if (receivedMessage.type === 'trigger-highlight' && receivedMessage.selector) {
        var $elementToHighlight = $(receivedMessage.selector);

        if ($elementToHighlight.length) {
            var nativeElement = $elementToHighlight.get(0);

            hoverElement(nativeElement, true);
        }
    }
});