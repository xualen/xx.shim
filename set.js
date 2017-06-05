 window.store = {};
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
             dep.emit(this.exp, store);
         } else {
             store[this.exp] = this.value;
             dep.emit(this.exp, store);
         }
     }
 }

 window.set = function(exp, value) {
     return new Set(exp, value);
 }

 function obsArr(o, p, exp) {
     if (type(o[p], 'Array')) {
         var arr = o[p];
         var proto = Array.prototype;
         var method = ['push', 'pop', 'unshift', 'shift', 'sort', 'reverse', 'splice'];
         for (var i = method.length; i--;) {;
             ! function(i) {
                 var m = method[i];
                 arr[m] = function() {
                     proto[m].apply(arr, arguments);
                     var cur = o[p];
                     dep.emit(exp, store, m);
                 }
             }(i);
         }
         arr.clear = function() {
             o[p].length = 0;
             var cur = o[p];
             dep.emit(exp, store);
         }
         arr.set = function(index, value) {
             [].splice.call(arr, index, 1, value);
             var cur = o[p];
             dep.emit(exp, store);
         }
         loopArr(o[p], exp);
     }
 }

 function loopArr(o, exp) {
     for (var p in o) {
         if (typeof exp == 'undefined') {
             var exps = p;
         } else {
             var exps = exp;
         }
         obsArr(o, p, exps);
     }
 }