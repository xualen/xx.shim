var dir = {
    xif: function(node, store) {
        var exp = node.getAttribute('x-if');
        parse(node, store);
        var parent = node.parentNode;
        var end = document.createComment('if' + Date.now());
        parent.insertBefore(end, node);
        node.removeAttribute("x-if");
        var go = function(store) {
            var parent = end.parentNode;
            if (!store[exp]) {
                parent.removeChild(node);
            } else {
                parent.insertBefore(node, end);
            }
            parseMe(node, store);
        }
        dep.on(exp, go);
        go(store);
    },
    xfor: function(node, store, method) {
        var start = document.createComment("start");
        var end = document.createComment("end");
        var parent = node.parentNode;
        var exp = node.getAttribute('x-for');
        parent.replaceChild(end, node);
        parent.insertBefore(start, end);
        var range = document.createRange();
        node.removeAttribute("x-for");
        var go = function(store, method) {
            var arr = store[exp];
            var parent = end.parentNode;
            range.setStart(start, start.nodeValue.length);
            range.setEnd(end, 0);
            range.deleteContents();
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                var index = i;
                var obj = create(store);
                var clone = node.cloneNode(true);
                parent.insertBefore(clone, end);
                obj['$el'] = item;
                obj['$index'] = index;
                parse(clone, obj);
                parseMe(clone, obj);
            }
        }
        dep.on(exp, go);
        go(store)
    },
    on: function(node, store) {
        var attrs = [].slice.call(node.attributes);
        for (i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (attr.name.indexOf('x-on') != -1) {
                var event = attr.name.substr(attr.name.lastIndexOf('-') + 1);
                node['on' + event] = store[attr.value];
                node.removeAttribute(attr.name);
            }
        }
    },
    attr: function(node, store) {
        var attrs = [].slice.call(node.attributes);
        for (i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (attr.name.indexOf('x-attr') != -1) {
                var attrName = attr.name.substr(attr.name.lastIndexOf('-') + 1);
                var exp = attr.value;
                node.removeAttribute(attr.name);
                var go = function(store) {
                    node.setAttribute(attrName, store[exp]);
                }
                dep.on(exp, go);
                go(store);
            }
        }
    },
    prop: function(node, store) {
        var attrs = [].slice.call(node.attributes);
        for (i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (attr.name.indexOf('x-prop') != -1) {
                var prop = attr.name.substr(attr.name.lastIndexOf('-') + 1);
                var exp = attr.value;
                node.removeAttribute(attr.name);
                var go = function(store) {
                    node[prop] = store[exp];
                }
                dep.on(exp, go);
                go(store);
            }
        }
    },
    html: function(node, store) {
        var attrs = [].slice.call(node.attributes);
        for (i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (attr.name.indexOf('x-html') != -1) {
                var exp = attr.value;
                node.removeAttribute(attr.name);
                var go = function(store) {
                    node.innerHTML = store[exp];
                }
                dep.on(exp, go);
                go(store);
            }
        }
    },
    value: function(node, store) {
        var attrs = [].slice.call(node.attributes);
        for (i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (attr.name.indexOf('x-value') != -1) {
                var exp = attr.value;
                node.removeAttribute(attr.name);
                var go = function(store) {
                    node.value = store[exp];
                }
                dep.on(exp, go);
                go(store);
            }
        }
    },
    render: function(node, store) {
        var attrs = [].slice.call(node.attributes);
        for (i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (attr.name.indexOf('x-render') != -1) {
                var event = attr.name.substr(attr.name.lastIndexOf('-') + 1);
                var exp = attr.value;
                node.removeAttribute(attr.name);
                var timer = setTimeout(function() {
                    store[exp].call(node);
                    clearTimeout(timer);
                    timer = null;
                })
            }
        }
    }
};