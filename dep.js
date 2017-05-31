function Dep(scope) {
    this.exp = {};
    this.scope = scope || {};
}
Dep.prototype = {
    on: function(exp, fn) {
        var me = this;
        if (isFalse(me.exp[exp])) {
            me.exp[exp] = [];
            me.exp[exp].push(fn);
        } else {
            me.exp[exp].push(fn);
        }
    },
    gg: function() {
        var me = this;
        if (typeof me.exp['$el'] != 'undefined') me.exp['$el'] = [];
        if (typeof me.exp['$index'] != 'undefined') me.exp['$index'] = [];
    },
    emit: function(exp) {
        var me = this;
        var arr = me.exp[exp];
        var args = [].slice.call(arguments);
        var first = args.shift();
        if (exp in me.exp) {
            for (var i = 0; i < arr.length; i++) {
                var fn = arr[i];
                fn.apply(me.scope, args);
            }
            me.gg();
        }
    }
}