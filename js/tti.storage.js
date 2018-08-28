if (typeof TTI == "undefined") {
	var TTI = {};
}
TTI.Storage = function (type, prefix) {
	if (!prefix) {
		throw ('configuration error: set TTI.Storage needs prefix');
		return false;
	};
	var self = {};
	self.setItem = function (k, v) {
		return localStorage.setItem(prefix + k, v);
	};

	self.getItem = function (k, success,error) {
		var result = localStorage.getItem(prefix + k);
		if (success && result) {
			success(result);
		}
		else if (error) {
		  error(result);
		}
		
		return result;
	};

	self.setObject = function (k, v) {
		
		if (v == undefined)
			value = null;
		else value = v;
		localStorage.setItem(prefix + k, JSON.stringify(value));
	};
	self.getObject = function (k, cb) {
		var str = localStorage.getItem(prefix + k);
		var result = JSON.parse(str);
		if (cb && result) {
			cb(result);
		}
		return result;

	};

	self.removeItem = function (k) {
		return localStorage.removeItem(prefix + k);
	};

	self.clear = function () {
		TTI.clearLocalStorage();
	}

	return self;
};
