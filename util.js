function type(p, t) {
    return {}.toString.call(p).slice(8, -1) == t;
}

function toStr(obj) {
    var arr = [];
    var type = function(o, t) {
        return {}.toString.call(o).slice(8, -1) == t;
    }
    if (type(obj, 'Object')) {
        arr.push("{");
        for (var p in obj) {
            arr.push(p, ":", toStr(obj[p]), ",");
        }
        arr.push("}");
    } else if (type(obj, 'Array')) {
        arr.push("[");
        for (var i = 0; i < obj.length; i++) {
            arr.push(toStr(obj[i]), ',');
        }
        arr.push("]");
    } else if (type(obj, 'Function')) {
        arr.push(obj.toString());
    } else {
        arr.push(JSON.stringify(obj));
    }
    return arr.join("");
}


function isFalse(p) {
    return typeof p == 'undefined';
}

function tpl(html, option) {
    var html = html.replace(/[\n\t]/g, '');
    html = html.replace(/["]/g, '');
    var patt = /\{\{(.+?)\}\}/g;
    var match = '';
    var index = 0;
    var code = 'with(obj){var r="";\n';
    while (match = patt.exec(html)) {
        code += 'r+="' + html.slice(index, match.index) + '";\n';
        code += 'r+=' + match[1] + ';\n';
        index = match.index + match[0].length;
    }
    code += 'r+="' + html.substr(index) + '";\n};\n';
    code += 'return r;\n';
    var fn = new Function('obj', code).call(option, option);
    return fn;
}

function getDir(name) {
    var type = '';
    var patt = /(?:x-)([a-zA-Z]+)(?:[-]*)/g;
    if (name.indexOf('x-') != -1) {
        type = patt.exec(name)[1];
    } else {
        type = false;
    }
    return type;
}

function create(obj) {
    function O() {}
    O.prototype = obj;
    return new O();
}