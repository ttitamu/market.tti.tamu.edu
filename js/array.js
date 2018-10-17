///////////Array prototype versions //////////


//some ES-native aliases for Chris's Smalltalk-like Collection coding habits
Array.prototype.collect = Array.prototype.map;
Array.prototype.each = Array.prototype.forEach;
Array.prototype.select = Array.prototype.filter;



Array.prototype.reject = function(test) {
	return this.select(function(element) { return !test(element); });

}



//detect returns the first element which passes the test, or false. aka "find"
Array.prototype.detect = function (test) {
	for (var i = 0; i < this.length; i += 1) {
		if (test(this[i])) {
			return this[i];
		}
	}

	return false;
};


Array.prototype.contains = function (x) { //does the array contain x?
	var result = this.detect(function (n) { return n == x; });
	return (result !== false);
};


//each runs a block of code on each element
Array.prototype.each = function (fn) {
	for (var i = 0; i < this.length; i += 1) {
		fn(this[i]);
	}
};

Array.prototype.inject = function (acc, fn) {
	var result = acc;
	this.each(function (e) {
		result = fn(result, e);
	});
	return result;
};





Array.prototype.atRandom = function () {
	if (this.length === 0) { return false; }
	var i = Math.floor(Math.random() * this.length);
	return this[i];
};

Array.prototype.shuffle = function(){
	var result = this.collect(function(x) { return x; });  //make a copy, do all state changing on the new copy.
	for(var j, x, i = result.length; i; j = parseInt(Math.random() * i), x = result[--i], result[i] = result[j], result[j] = x);
	return result;
};




Array.prototype.integrate = function (fn) {
return this.inject(0, function (acc, i) { return acc + fn(i); });
};

/* Array.prototype.sum = function () {
return this.integrate(function (x) { return x; });
}; */
Array.prototype.sum = function(){

	if ($.isNumeric(this[0])){
		return this.inject(0,function(a,b){return a+b;});
	}
	if ($.isPlainObject(this[0])){
		var result = {};
		var keys = Object.keys(this[0]);
		keys.each(function(k){result[k]=0;});
		return this.inject(result,function(a,b){
			keys.each(function(k){
			//console.log('k:',k,'a[k]:',a[k],'b[k]:',b[k]);
				a[k]=a[k]+b[k];
				});
			return a;
		});
	}
	if ($.isPlainObject(this)){
			var keys = Object.keys(o);
			return keys.inject(0,function(res,i){return res+o[i];});
	}
	console.log('Error: The input is not valid!(Array.prototype.sum())');

}
/* IE doesn't support Array.indexOf, so here, hold my hand while we cross the street */
if (!Array.indexOf) {
Array.prototype.indexOf = function (obj) {
for (var i = 0; i < this.length; i++) {
if (this[i] == obj) {
return i;
}
}
return -1;
}
}

Array.prototype.eachPCN = function(callback) { //gives your callback a view of previous, current, and next

var length = this.length;
var c,p,n = false;
switch(length) {
case 0:
console.log('err-OR! does not compute. ');
break;
case 1:
c = 0; n = 0; p = 0;
break;
case 2:
c = 0; n = 1; p = 1;
break;
default:
c = 0; n = 1; p = length - 1;
break;
}

for(var i = 0; i < length; i += 1) {
callback({ prev: this[p], current: this[c], next: this[n], p: p, c: c, n: n, length: length });
c += 1; c %= length;
n += 1; n %= length;
p += 1; p %= length;
}
};



Array.prototype.unique = function()
{
var n = {},r=[];
for(var i = 0; i < this.length; i++)
{
if (!n[this[i]])
{
n[this[i]] = true;
r.push(this[i]);
}
}
return r;
}

if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}
