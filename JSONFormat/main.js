// 触发background的chrome.runtime.onConnect.addListener
var port = chrome.runtime.connect();


function init(text) {
     var data = JSON.parse(text);
     var parent = '<div id="json-container"><div id="downloads" class="btn">下载</div>'
     var body = displayUi(data);
     document.body.innerHTML = parent + body + '</div>'
     addAction()
}

function addAction() {
    document.getElementById('downloads').onclick = function() {
        console.log('send', port)
        port.postMessage({
            url: window.location.href,
        });
    }
    document.body.onclick = ontoggle;
    document.body.onmousemove = onmouseMove

}

function getParentLI(element) {
    if (element.tagName != "LI")
        while (element && element.tagName != "LI")
            element = element.parentNode;
    if (element && element.tagName == "LI")
        return element;
}

var onmouseMove = (function() {
    var hoveredLI;

    function onmouseOut() {
        console.log('mouseout', hoveredLI)
        if (hoveredLI) {
            hoveredLI.firstChild.classList.remove("hovered");
            hoveredLI = null;
        }
    }

    return function(event) {
        if (event.isTrusted === false)
            return;
        var element = getParentLI(event.target);
        // 如果在 li 里面会处理上一次没有处理的元素，但是在找不到 parent 为 li 的时候就必须手动释放上一次的元素
        if (element) {
            if (hoveredLI)
                // 存储上一次的未释放的元素
                hoveredLI.firstChild.classList.remove("hovered");
            hoveredLI = element;
            element.firstChild.classList.add("hovered");
            return;
        }
        // 执行释放
        onmouseOut();
    };
})();


function ontoggle(event) {
    var collapsed, target = event.target;
    if (event.target.className == 'collapser') {
        collapsed = target.parentNode.getElementsByClassName('collapsible')[0];
        if (collapsed.parentNode.classList.contains("collapsed"))
            collapsed.parentNode.classList.remove("collapsed");
        else
            collapsed.parentNode.classList.add("collapsed");
    }
}
function htmlEncode(t) {
    return t != null ? t.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
}

function decorateWithSpan(value, className) {
    return '<span class="' + htmlEncode(className) + '">' + htmlEncode(value) + '</span>';
}

function displayUi(d) {
    var output = '';
    if(d === null) {
        output = output + decorateWithSpan('null', 'null')
    }
    if(Object.prototype.toString.call(d) === '[object Object]') {
        output = output + objToJson(d)
    }
    if(Object.prototype.toString.call(d) === '[object Array]') {
        output = output + arrToJson(d)
    }
    if(typeof d === 'number') {
        output = output+decorateWithSpan(d, 'number')
    }
    if(typeof d === 'string') {
        var style = 'string'
        if(d.indexOf('http') > -1) {
            style = style + '    url'
        }
        output = output+decorateWithSpan(d, style)
    }
    if(typeof d === 'boolean') {
        output = output+decorateWithSpan(d, 'number')
    }
    return output
}
function arrToJson(json) {
    var i, key, length=json.length, output = '<div class="collapser"></div>{' +
        '<span class="ellipsis"></span><ul class="array collapsible">', hasContents = false;
    for (i = 0; i < length; i++) {
        key = json[i];
        hasContents = true;
        output += '<li><div class="hoverable">';
        output += displayUi(key);
        if (i < length - 1)
            output += ',';
        output += '</div></li>';
    }
    output += '</ul>}';
    if (!hasContents)
        output = "[]";
    return output;
}
function objToJson(json) {
    var i, key, length, keys = Object.keys(json), output = '<div class="collapser"></div>{' +
        '<span class="ellipsis"></span><ul class="obj collapsible">', hasContents = false;
    for (i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        hasContents = true;
        output += '<li><div class="hoverable">';
        output += '<span class="property">' + htmlEncode(key) + '</span>: ';
        output += displayUi(json[key]);
        if (i < length - 1)
            output += ',';
        output += '</div></li>';
    }
    output += '</ul>}';
    if (!hasContents)
        output = "{}";
    return output;
}

function getJson() {
    if (document.body && (document.body.childNodes[0] && document.body.childNodes[0].tagName == "PRE" || document.body.children.length == 0)) {
        var child = document.body.children.length ? document.body.childNodes[0] : document.body;
        init(child.innerText);
    }
}
getJson()
