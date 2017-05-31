var store = {};
var dep = new Dep(store);

function Set(exp, value) {
    this.exp = exp;
    this.value = value;
    this.update();
}
Set.prototype = {
    update: function() {
        if (type(this.value, 'Array')) {
            store[this.exp] = JSON.parse(JSON.stringify(this.value));
            obsArr(store, this.exp, dep);
            dep.emit(this.exp, store);
        } else {
            store[this.exp] = this.value;
            dep.emit(this.exp, store);
        }
    }
}

function set(exp, value) {
    return new Set(exp, value);
}

function obsArr(o, p, dep) {
    var last = JSON.parse(JSON.stringify(o[p]));
    var arr = o[p];
    var proto = Array.prototype;
    if (type(last, 'Array')) {
        var method = ['push', 'pop', 'unshift', 'shift', 'sort', 'reverse', 'splice'];
        for (var i = method.length; i--;) {;
            ! function(i) {
                var m = method[i];
                arr[m] = function() {
                    proto[m].apply(arr, arguments);
                    var cur = o[p];
                    (toStr(cur) != toStr(last)) && ! function() {
                        dep.emit(p, o, m);
                    }();
                }
            }(i);
        }
        arr.clear = function() {
            o[p] = [];
            var cur = o[p];
            (toStr(cur) != toStr(last)) && ! function() {
                dep.emit(p, o);
            }();
        }
        arr.set = function(index, value) {
            [].splice.call(arr, index, 1, value);
            var cur = o[p];
            (toStr(cur) != toStr(last)) && ! function() {
                dep.emit(p, o);
            }();
        }
    }
}