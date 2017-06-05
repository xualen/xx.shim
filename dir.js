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
             if (!compute(store, exp)) {
                 parent.removeChild(node);
             } else {
                 parent.insertBefore(node, end);
             }
             parseMe(node, store);
         }
         dep.on(exp, go);
         go(store);
     },
     xfor: function(node, store) {
         var start = document.createComment("start");
         var end = document.createComment("end");
         var parent = node.parentNode;
         var exp = node.getAttribute('x-for');
         parent.replaceChild(end, node);
         parent.insertBefore(start, end);
         node.removeAttribute("x-for");
         var go = function(store, method) {
             var arr = compute(store, exp);
             var parent = end.parentNode;
             while (true) {
                 if (end.previousSibling == start || !end.previousSibling) {
                     break;
                 }
                 parent.removeChild(end.previousSibling);
             }
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
         var attrs = [].concat.apply([], node.attributes);
         for (i = 0; i < attrs.length; i++) {
             var attr = attrs[i];
             if (attr.name.indexOf('x-on') != -1) {
                 var event = attr.name.substr(attr.name.lastIndexOf('-') + 1);
                 var exp = attr.value;
                 node['on' + event] = compute(store, exp);
                 node.removeAttribute(attr.name);
             }
         }
     },
     attr: function(node, store) {
         var attrs = [].concat.apply([], node.attributes);
         for (i = 0; i < attrs.length; i++) {
             var attr = attrs[i];
             if (attr.name.indexOf('x-attr') != -1) {
                 var attrName = attr.name.substr(attr.name.indexOf('attr-') + 5);
                 var exp = attr.value;
                 node.removeAttribute(attr.name);
                 var go = function(store) {
                     node.setAttribute(attrName, compute(store, exp));
                 }
                 dep.on(exp, go);
                 go(store);
             }
         }
     },
     prop: function(node, store) {
         var attrs = [].concat.apply([], node.attributes);
         for (i = 0; i < attrs.length; i++) {
             var attr = attrs[i];
             if (attr.name.indexOf('x-prop') != -1) {
                 var prop = attr.name.substr(attr.name.lastIndexOf('-') + 1);
                 var exp = attr.value;
                 node.removeAttribute(attr.name);
                 var go = function(store) {
                     node[prop] = compute(store, exp);
                 }
                 dep.on(exp, go);
                 go(store);
             }
         }
     },
     html: function(node, store) {
         var attrs = [].concat.apply([], node.attributes);
         for (i = 0; i < attrs.length; i++) {
             var attr = attrs[i];
             if (attr.name.indexOf('x-html') != -1) {
                 var exp = attr.value;
                 node.removeAttribute(attr.name);
                 var go = function(store) {
                     node.innerHTML = compute(store, exp);
                 }
                 dep.on(exp, go);
                 go(store);
             }
         }
     },
     value: function(node, store) {
         var attrs = [].concat.apply([], node.attributes);
         for (i = 0; i < attrs.length; i++) {
             var attr = attrs[i];
             if (attr.name.indexOf('x-value') != -1) {
                 var exp = attr.value;
                 node.removeAttribute(attr.name);
                 var go = function(store) {
                     node.value = compute(store, exp);
                 }
                 dep.on(exp, go);
                 go(store);
             }
         }
     },
     render: function(node, store) {
         var attrs = [].concat.apply([], node.attributes);
         for (i = 0; i < attrs.length; i++) {
             var attr = attrs[i];
             if (attr.name.indexOf('x-render') != -1) {
                 var event = attr.name.substr(attr.name.lastIndexOf('-') + 1);
                 var exp = attr.value;
                 node.removeAttribute(attr.name);
                 var timer = setTimeout(function() {
                     compute(store, exp).call(node);
                     clearTimeout(timer);
                     timer = null;
                 })
             }
         }
     }
 };