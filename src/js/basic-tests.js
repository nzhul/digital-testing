import './jquery.inlineedit.js';

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

eventer(messageEvent, function (e) {
    var receivedMessage = e.data;
    if (receivedMessage.type === 'highlight') {
        $("#highlighter").css({
            'top': receivedMessage.t + 'px',
            'left': receivedMessage.l + 'px',
            'width': receivedMessage.w + 'px',
            'height': receivedMessage.h + 'px'
        });
    }
    else if (receivedMessage.type === 'selected-element') {
        alert(receivedMessage.selector)
    }
}, false);

$('#selectBtn').click(function () {
    var siteFrame = $('#site-content iframe').get(0);
    siteFrame.contentWindow.postMessage({
        type: 'trigger-highlight',
        selector: $("#selectorInput").val()
    }, '*');
});

$("#testPanel").kendoPanelBar();
$('.editable').inlineEdit({
      buttons: '<a href="#" class="save"><i class="fa fa-pencil-square" aria-hidden="true"></i></a> <a href="#" class="cancel"><i class="fa fa-times"></i></a>',
      buttonsTag: 'a'
    });