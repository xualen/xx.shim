window.scan = function() {
    var body = document.body;
    var frag = nodeToFrag(body);
    parse(frag, store);
    body.appendChild(frag);
}

function nodeToFrag(node) {
    var childs = [].concat.apply([], node.childNodes);
    var frag = document.createDocumentFragment();
    for (var i = 0; i < childs.length; i++) {
        frag.appendChild(childs[i]);
    }
    return frag;
}

function parseMe(node, store) {
    if (node.nodeType == 1) {
        parseNode(node, store);
    }
}

function parse(node, store) {
    var childs = [].concat.apply([], node.childNodes);
    if (!childs) return;
    for (var i = 0; i < childs.length; i++) {
        var child = childs[i];
        if (child.nodeType == 1) {
            if (child.nodeName == 'SCRIPT') continue;
            parseNode(child, store);
        } else if (child.nodeType == 3) {
            parseText(child, store);
        }
    }
}

function parseText(node, store) {
    var content = node.nodeValue;
    var go = function(store) {
        var template = tpl(content, store);
        node.nodeValue = template;
    }
    var patt = /\{\{(.+?)\}\}/g;
    var match = null;
    content.replace(/[\n\t]/g, '');
    while (match = patt.exec(content)) {
        dep.on(match[1], go);
    }
    go(store);
}

function parseNode(node, store) {
    var attrs = [].concat.apply([], node.attributes);
    var temp = [];
    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];
        temp.push(attr.name);
    }
    if (temp.join(",").indexOf('x-if') != -1) {
        dir['xif'](node, store);
    } else if (temp.join(",").indexOf('x-for') != -1) {
        dir['xfor'](node, store);
    } else {
        for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (attr.name.indexOf('x-') != -1) {
                dir[getDir(attr.name)](node, store);
            };
        }
        parse(node, store);
    }
}

var scanTimer = setTimeout(function() {
    scan();
    loopArr(store);
    clearTimeout(scanTimer);
    scanTimer = null;
})