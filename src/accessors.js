'use strict';

(function(Bacon, alia, undefined) {

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Schedule

	var schedule;
	var _MutationObserver;
	if (typeof process === "object" && typeof process.version === "string") {
		schedule = function Promise$_Scheduler(fn) {
			process.nextTick(fn);
		};
	} else if ((typeof MutationObserver !== "undefined" &&
			(_MutationObserver = MutationObserver)) ||
		(typeof WebKitMutationObserver !== "undefined" &&
			(_MutationObserver = WebKitMutationObserver))) {
		schedule = (function() {
			var div = document.createElement("div");
			var queuedFn = void 0;
			var observer = new _MutationObserver(
				function Promise$_Scheduler() {
					var fn = queuedFn;
					queuedFn = void 0;
					fn();
				}
			);
			observer.observe(div, {
				attributes: true
			});
			return function Promise$_Scheduler(fn) {
				queuedFn = fn;
				div.setAttribute("class", "foo");
			};

		})();
	} else if (typeof setTimeout !== "undefined") {
		schedule = function Promise$_Scheduler(fn) {
			setTimeout(fn, 0);
		};
	} else throw new Error("no async scheduler available");
	//module.exports = schedule;

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Queue

	function arrayCopy(src, srcIndex, dst, dstIndex, len) {
		for (var j = 0; j < len; ++j) {
			dst[j + dstIndex] = src[j + srcIndex];
		}
	}

	function Queue(capacity) {
		this._capacity = capacity;
		this._length = 0;
		this._front = 0;
		this._makeCapacity();
	}

	Queue.prototype._willBeOverCapacity =
		function Queue$_willBeOverCapacity(size) {
			return this._capacity < size;
	};

	Queue.prototype._pushOne = function Queue$_pushOne(arg) {
		var length = this.length();
		this._checkCapacity(length + 1);
		var i = (this._front + length) & (this._capacity - 1);
		this[i] = arg;
		this._length = length + 1;
	};

	Queue.prototype.push = function Queue$push(fn, receiver, arg) {
		var length = this.length() + 3;
		if (this._willBeOverCapacity(length)) {
			this._pushOne(fn);
			this._pushOne(receiver);
			this._pushOne(arg);
			return;
		}
		var j = this._front + length - 3;
		this._checkCapacity(length);
		var wrapMask = this._capacity - 1;
		this[(j + 0) & wrapMask] = fn;
		this[(j + 1) & wrapMask] = receiver;
		this[(j + 2) & wrapMask] = arg;
		this._length = length;
	};

	Queue.prototype.shift = function Queue$shift() {
		var front = this._front,
			ret = this[front];

		this[front] = void 0;
		this._front = (front + 1) & (this._capacity - 1);
		this._length--;
		return ret;
	};

	Queue.prototype.length = function Queue$length() {
		return this._length;
	};

	Queue.prototype._makeCapacity = function Queue$_makeCapacity() {
		var len = this._capacity;
		for (var i = 0; i < len; ++i) {
			this[i] = void 0;
		}
	};

	Queue.prototype._checkCapacity = function Queue$_checkCapacity(size) {
		if (this._capacity < size) {
			this._resizeTo(this._capacity << 3);
		}
	};

	Queue.prototype._resizeTo = function Queue$_resizeTo(capacity) {
		var oldFront = this._front;
		var oldCapacity = this._capacity;
		var oldQueue = new Array(oldCapacity);
		var length = this.length();

		arrayCopy(this, 0, oldQueue, 0, oldCapacity);
		this._capacity = capacity;
		this._makeCapacity();
		this._front = 0;
		if (oldFront + length <= oldCapacity) {
			arrayCopy(oldQueue, oldFront, this, 0, length);
		} else {
			var lengthBeforeWrapping =
				length - ((oldFront + length) & (oldCapacity - 1));

			arrayCopy(oldQueue, oldFront, this, 0, lengthBeforeWrapping);
			arrayCopy(oldQueue, 0, this, lengthBeforeWrapping,
				length - lengthBeforeWrapping);
		}
	};

	//module.exports = Queue;

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Utils

	var errorObj = {
		e: {}
	};

	function tryCatch1(fn, receiver, arg) {
		try {
			return fn.call(receiver, arg);
		} catch (e) {
			errorObj.e = e;
			return errorObj;
		}
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Async

	var _process = typeof process !== "undefined" ? process : void 0;

	function Async() {
		this._isTickUsed = false;
		this._schedule = schedule;
		this._length = 0;
		this._lateBuffer = new Queue(16);
		this._functionBuffer = new Queue(65536);
		var self = this;
		this.consumeFunctionBuffer = function Async$consumeFunctionBuffer() {
			self._consumeFunctionBuffer();
		};
	}

	Async.prototype.haveItemsQueued = function Async$haveItemsQueued() {
		return this._length > 0;
	};

	Async.prototype.invokeLater = function Async$invokeLater(fn, receiver, arg) {
		if (_process !== void 0 &&
			_process.domain != null &&
			!fn.domain) {
			fn = _process.domain.bind(fn);
		}
		this._lateBuffer.push(fn, receiver, arg);
		this._queueTick();
	};

	Async.prototype.invoke = function Async$invoke(fn, receiver, arg) {
		if (_process !== void 0 && _process.domain != null && !fn.domain) {
			fn = _process.domain.bind(fn);
		}
		var functionBuffer = this._functionBuffer;
		functionBuffer.push(fn, receiver, arg);
		this._length = functionBuffer.length();
		this._queueTick();
	};

	Async.prototype._consumeFunctionBuffer = function Async$_consumeFunctionBuffer() {
		var functionBuffer = this._functionBuffer;
		while (functionBuffer.length() > 0) {
			var fn = functionBuffer.shift();
			var receiver = functionBuffer.shift();
			var arg = functionBuffer.shift();
			fn.call(receiver, arg);
		}
		this._reset();
		this._consumeLateBuffer();
	};

	Async.prototype._consumeLateBuffer = function Async$_consumeLateBuffer() {
		var buffer = this._lateBuffer;
		while (buffer.length() > 0) {
			var fn = buffer.shift();
			var receiver = buffer.shift();
			var arg = buffer.shift();
			var res = tryCatch1(fn, receiver, arg);
			if (res === errorObj) {
				this._queueTick();
				if (fn.domain != null) {
					fn.domain.emit("error", res.e);
				} else {
					throw res.e;
				}
			}
		}
	};

	Async.prototype._queueTick = function Async$_queue() {
		if (!this._isTickUsed) {
			this._schedule(this.consumeFunctionBuffer);
			this._isTickUsed = true;
		}
	};

	Async.prototype._reset = function Async$_reset() {
		this._isTickUsed = false;
		this._length = 0;
	};

	var async = new Async();


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Unresolved

	function Unresolved() {}

	Unresolved.is = function(value) {
		return value instanceof Unresolved;
	}

	Unresolved.not = function(value) {
		return !(value instanceof Unresolved);
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Accessor

	function Accessor(resolved, value, finalized) {
		this._resolved = (resolved === true);
		this._value = value;
		this._failed = false;
		this._errors = void 0;

		this._resolveHandlers = void 0; // 1, value 16
		this._unresolveHandlers = void 0; // 2
		this._errorHandlers = void 0; // 4, error 32

		this._broadcastPending = false;
		this._broadcastGroup = 0; // null
		this._broadcastHandlers = void 0; // 8

		this._finalized = (finalized === true);
	};

	// --------------------------------------------------
	// Private methods

	Accessor.prototype._broadcast = function() {
		var data, handlers;
		if (this._broadcastGroup & 16) {
			data = this._value;
		} else if (this._broadcastGroup & 32) {
			data = this._errors;
		}
		if (this._broadcastGroup & 1 && this._resolveHandlers) {
			for (var i = 0; i < this._resolveHandlers.length; ++i) {
				this._resolveHandlers[i].call(void 0, data);
			}
		}
		if (this._broadcastGroup & 2 && this._unresolveHandlers) {
			for (var i = 0; i < this._unresolveHandlers.length; ++i) {
				this._unresolveHandlers[i].call(void 0, data);
			}
		}
		if (this._broadcastGroup & 4 && this._errorHandlers) {
			for (var i = 0; i < this._errorHandlers.length; ++i) {
				this._errorHandlers[i].call(void 0, data);
			}
		}
		if (this._broadcastGroup & 8) {
			for (var i = 0; i < this._broadcastHandlers.length; ++i) {
				this._broadcastHandlers[i].call(void 0, data);
			}
		}
		if (this._finalized) {
			this._resolveHandlers = void 0;
			this._unresolveHandlers = void 0;
			this._errorHandlers = void 0;
		}
		this._broadcastPending = false;
		this._broadcastGroup = 0;
		this._broadcastHandlers = void 0;
	};

	Accessor.prototype._finalize = function() {
		this._finalized = true;
		if (!this._broadcastPending) {
			this._resolveHandlers = void 0;
			this._unresolveHandlers = void 0;
			this._errorHandlers = void 0;
			this._broadcastGroup = 0;
			this._broadcastHandlers = void 0;
		}
	};

	Accessor.prototype._resolve = function(value, handler) {
		if (typeof handler !== 'function') {
			if (this._resolved && this._value === value) {
				return;
			}
			this._resolved = true;
			this._value = value;
			this._failed = false;
			this._errors = void 0;
			this._broadcastGroup = 17;
			this._broadcastHandlers = void 0;
		} else if (this._broadcastGroup === 0) {
			this._broadcastGroup = 24;
			this._broadcastHandlers = [handler];
		} else if (this._broadcastGroup === 24) {
			this._broadcastHandlers.push(handler);
		} else if (!(this._broadcastGroup & 1)) {
			throw new Error('Unable to prime resolve to group ' + this._broadcastGroup);
		}
		if (!this._broadcastPending) {
			this._broadcastPending = true;
			async.invoke(this._broadcast, this);
		}
	};

	Accessor.prototype._throw = function(error, handler) {
		var unresolving = this._resolved;
		if (!handler) {
			this._resolved = false;
			this._value = void 0;
			this._failed = true;
			if (this._errors === void 0) {
				this._errors = [];
			}
			this._errors.push(error);
			this._broadcastGroup = (unresolving) ? 38 : 36;
			this._broadcastHandlers = void 0;
		} else if (unresolving) {
			throw new Error('Unable to initialize throw with handler');
		} else if (this._broadcastGroup === 0) {
			this._broadcastGroup = 40;
			this._broadcastHandlers = [handler];
		} else if (this._broadcastGroup === 40) {
			this._broadcastHandlers.push(handler);
		} else if (!(this._broadcastGroup & 4)) {
			throw new Error('Unable to prime throw to group ' + this._broadcastGroup);
		}
		if (!this._broadcastPending) {
			this._broadcastPending = true;
			async.invoke(this._broadcast, this);
		}
	};

	Accessor.prototype._unresolve = function() {
		if (!this._resolved) {
			return;
		}
		this._resolved = false;
		this._value = void 0;
		this._failed = false;
		this._errors = void 0;
		this._broadcastGroup = 2;
		this._broadcastHandlers = void 0;
		if (!this._broadcastPending) {
			this._broadcastPending = true;
			async.invoke(this._broadcast, this);
		}
	};

	// --------------------------------------------------
	// Public methods

	Accessor.prototype.get = function() {
		return this._resolved ? _.clone(this._value) : void 0;
	};

	Accessor.prototype.isGettable = function() {
		return true;
	};

	Accessor.prototype.isSettable = function() {
		return typeof this.set === 'function';
	};

	Accessor.prototype.observe = function(resolveHandler, unresolveHandler, errorHandler) {
		if (typeof resolveHandler === 'function') {
			if (!this._resolveHandlers) {
				this._resolveHandlers = [];
			}
			this._resolveHandlers.push(resolveHandler);
			if (this._resolved) {
				this._resolve(this._value, resolveHandler);
			}
		}
		if (typeof unresolveHandler === 'function') {
			if (!this._unresolveHandlers) {
				this._unresolveHandlers = [];
			}
			this._unresolveHandlers.push(unresolveHandler);
		}
		if (typeof errorHandler === 'function') {
			if (!this._errorHandlers) {
				this._errorHandlers = [];
			}
			this._errorHandlers.push(errorHandler);
			if (this._failed) {
				this._throw(this._errors, errorHandler);
			}
		}
		return this;
	};

	Accessor.prototype.onResolve = function(handler) {
		return this.observe(handler, null, null);
	};

	Accessor.prototype.onUnresolve = function(handler) {
		return this.observe(null, handler, null);
	};

	Accessor.prototype.onError = function(handler) {
		return this.observe(null, null, handler);
	};

	// --------------------------------------------------
	// Reactive property methods

	Accessor.prototype.isObject = function() {
		var accessor = new ValueAccessor();
		this.observe(function(value) {
			accessor.set(typeof value === 'object');
		}, function() {
			accessor.set(false);
		}, function(err) {
			accessor._throw(err);
		});
		return accessor;
	};

	Accessor.prototype.isResolved = function() {
		var accessor = new ValueAccessor();
		this.observe(function(value) {
			accessor.set(true);
		}, function() {
			accessor.set(false);
		}, function(err) {
			accessor._throw(err);
		});
		return accessor;
	};

	Accessor.prototype.isUndefined = function() {
		var accessor = new ValueAccessor();
		this.observe(function(value) {
			accessor.set(value === void 0);
		}, function() {
			accessor.set(true);
		}, function(err) {
			accessor._throw(err);
		});
		return accessor;
	};

	// --------------------------------------------------
	// Lifting methods

	Accessor.prototype.at = function(index) {
		return new PropertyAccessor(this, '.' + index);
	};

	Accessor.prototype.delay = function(ms) {
		return new DelayAccessor(this, ms);
	};

	Accessor.prototype.not = function() {
		var accessor = new ValueAccessor();
		this.observe(function(value) {
			accessor.set(!value);
		}, function() {
			accessor._unresolve();
		}, function(err) {
			accessor._throw(err);
		});
		return accessor;
	};

	Accessor.prototype.property = function(property) {
		return new PropertyAccessor(this, property);
	};

	Accessor.prototype.startWith = function(value) {
		if (!this._resolved) {
			this._resolve(value);
		}
		return this;
	};

	Accessor.prototype.then = function(callback) {
		return new FutureAccessor([this], callback);
	};



	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Progressable

	// var progressable = {
	// 	_progress: void 0,
	// 	_progressHandlers = void 0
	// };

	// var asProgressable = (function() {
	// 	return function () {
	// 		this._progress = void 0;
	// 		this._progressHandlers = void 0;
	// 	};
	// })();

	// Accessor.prototype.onProgress = function(callback) {
	// 	return this.observe(null, null, callback);
	// };



	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Constant accessor

	function ConstantAccessor(resolved, value) {
		Accessor.call(this, resolved, value, true);
	}

	ConstantAccessor.prototype = _.create(Accessor.prototype);


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Value accessor

	function ValueAccessor(resolved, value) {
		Accessor.call(this, resolved, value);
	}

	ValueAccessor.prototype = _.create(Accessor.prototype);

	ValueAccessor.prototype.set = function(value) {
		this._resolve(value);
	};


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Property accessor

	function PropertyAccessor(accessor, property) {
		Accessor.call(this);
		this._accessor = accessor;
		this._property = property;
		this._path = property.split('.');

		var self = this;
		accessor.observe(function(value) {
			for (var i = 1; i < self._path.length; ++i) {
				if (value && value.hasOwnProperty(self._path[i])) {
					value = value[self._path[i]];
				} else {
					return self._unresolve();
				}
			}
			self._resolve(value);
		}, function() {
			self._unresolve();
		}, function(err) {
			self._throw(err);
		});
	}

	PropertyAccessor.prototype = _.create(Accessor.prototype);

	PropertyAccessor.prototype.set = function(value) {
		var obj = this._accessor.get() || {};
		var iter = obj;
		var end = this._path.length - 1;
		for (var i = 1; i < end; ++i) {
			if (!iter.hasOwnProperty(this._path[i])) {
				iter[this._path[i]] = {};
			}
			iter = iter[this._path[i]] || {};
		}
		iter[this._path[end]] = value;
		this._accessor.set(obj);
	};


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Array accessor

	function ArrayAccessor(accessor) {
		Accessor.call(this);
		this._accessor = accessor;
		this._items = void 0;
		this._itemsResolved = void 0;

		var self = this;
		accessor.observe(function(items) {
			self._items = [];
			self._itemsResolved = [];
			if (items.length === 0) {
				self._resolve([]);
			} else {
				for (var i = 0; i < items.length; ++i) {
					self._items.push(items[i]);
					self._itemsResolved.push(false);
					var item = items[i];
					if (!(item instanceof Accessor)) {
						self._items[i] = item = alia.constant(item);
					}
					item.observe(function(index) {
						return function(value) {
							self._itemsResolved[index] = true;
							if (!_.every(self._itemsResolved)) {
								return;
							}
							var result = [];
							for (var j = 0; j < self._items.length; ++j) {
								result.push(self._items[j]._value);
							}
							self._resolve(result);
						}
					}(i), function(index) {
						return function() {
							self._itemsResolved[index] = false;
							self._unresolve();
						}
					}(i), function(err) {
						self._throw(err);
					});
				}
			}
		}, function() {
			self._items = void 0;
			self._itemsResolved = void 0;
			self._unresolve();
		}, function(err) {
			self._throw(err);
		});
	}

	ArrayAccessor.prototype = _.create(Accessor.prototype);


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Object accessor

	function ObjectAccessor(object) {
		Accessor.call(this);
		this._object = {};

		var count = 0;
		var self = this;
		for (var p in object) {
			if (!(object[p] instanceof Accessor)) {
				self._object[p] = object[p];
			} else {
				count++;
				object[p].observe(function(key) {
					return function(value) {
						self._object[key] = value;
						if (!_.every(self._object, Unresolved.not)) {
							return;
						}
						self._resolve(_.clone(self._object));
					}
				}(p), function(key) {
					return function() {
						self._object[key] = new Unresolved();
						self._unresolve();
					}
				}(p), function(err) {
					self._throw(err);
				});
			}
		}
		if (count === 0) {
			self._resolve(this._object, true);
		}
	}

	ObjectAccessor.prototype = _.create(Accessor.prototype);


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Join accessor

	function JoinAccessor() {
		Accessor.call(this);
		this._fcn = arguments[arguments.length - 1];
		this._accessors = [];
		this._accessorsResolved = [];
		var self = this;
		for (var i = 0; i < arguments.length - 1; ++i) {
			self._accessors.push(arguments[i]);
			self._accessorsResolved.push(false);
			var item = arguments[i];
			if (!(item instanceof Accessor)) {
				self._accessors[i] = item = alia.constant(item);
			}
			item.observe(function(index) {
				return function(value) {
					self._accessorsResolved[index] = true;
					if (!_.every(self._accessorsResolved)) {
						return;
					}
					var args = [];
					for (var j = 0; j < self._accessors.length; ++j) {
						args.push(self._accessors[j]._value);
					}
					var result = self._fcn.apply(undefined, args);
					if (result instanceof Accessor) {
						result.observe(function(value) {
							self._resolve(value);
						}, function() {
							self._unresolve();
						}, function(err) {
							self._throw(err);
						});
					} else {
						self._resolve(result);
					}
				}
			}(i), function(index) {
				return function() {
					self._accessorsResolved[index] = false;
					self._unresolve();
				}
			}(i), function(err) {
				self._throw(err);
			});
		}
	}

	JoinAccessor.prototype = _.create(Accessor.prototype);


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Future accessor

	function FutureAccessor(args, fcn) {
		Accessor.call(this);
		this._fcn = fcn;
		this._args = alia.all(args);

		var self = this;
		this._args.observe(function(value) {
			var result = self._fcn.apply(undefined, value);
			if (result instanceof Accessor) {
				result.observe(function(value) {
					self._resolve(value);
				}, function() {
					self._unresolve();
				}, function(err) {
					self._throw(err);
				});
			} else {
				self._resolve(result);
			}
		}, function() {
			self._unresolve();
		}, function(err) {
			self._throw(err);
		});
	}

	FutureAccessor.prototype = _.create(Accessor.prototype);


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Promise accessor

	function PromiseAccessor(promise) {
		Accessor.call(this);

		var self = this;
		promise.then(function(value) {
			self._resolve(value, true);
		}, function(err) {
			self._throw(err);
		});
	}

	PromiseAccessor.prototype = _.create(Accessor.prototype);


	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Delay accessor

	function DelayAccessor(accessor, ms) {
		Accessor.call(this);
		this._accessor = accessor;
		this._delay = ms;
		this._timeout = null;

		var self = this;
		accessor.observe(function(value) {
			if (self._timeout) {
				clearTimeout(self._timeout);
			}
			self._timeout = setTimeout(function() {
				self._resolve(value);
				self._timeout = null;
			}, self._delay);
		}, function() {
			self._unresolve();
		}, function(err) {
			self._throw(err);
		});
	}

	DelayAccessor.prototype = _.create(Accessor.prototype);



	// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// // Future accessor

	// function MapAccessor(accessor, map) {
	// 	Accessor.call(this);
	// 	this._accessor = accessor;
	// 	this._items = null;
	// 	if (typeof map === 'function') {
	// 		this._map = map;
	// 	} else if (typeof map === 'string') {
	// 		this._map = function(item) {
	// 			return new PropertyAccessor(item, map);
	// 		}
	// 	} else {
	// 		this._map = _.identity;
	// 	}

	// 	var self = this;
	// 	accessor.onValue(function(value) {
	// 		var items = [];
	// 		var results = [];
	// 		for (var i = 0; i < value.length; ++i) {
	// 			items[i] = new PropertyAccessor(accessor, '.' + i);
	// 			results[i] = self._map(items[i]);
	// 			console.log("r" + i, results[i]);
	// 			results[i].onValue(function() {
	// 				console.log("inside");
	// 				for (var j = 0; j < results.length; ++j) {
	// 					if (!results[j]._resolved) {
	// 						return;
	// 					}
	// 				}
	// 				var values = [];
	// 				for (var j = 0; j < results.length; ++j) {
	// 					values.push(results[j]._value);
	// 				}
	// 				__set.call(self, values);
	// 			});
	// 		}
	// 	});
	// }

	// MapAccessor.prototype = _.create(Accessor.prototype);



	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Public functions

	alia.isAccessor = function(value) {
		return value instanceof Accessor;
	};

	/**
	 * Given an array, or an accessor to an array, which contains accessors (or a
	 * mix of accessors and values) return an accessor that represents the value when all items
	 * in the array are resolved. The accessors's resolved value is an array with resolved
	 * values at respective positions to the original array.
	 */
	alia.all = function(array) {
		if (!alia.isAccessor(array)) {
			array = alia.constant(array);
		}
		return new ArrayAccessor(array);
	};

	/**
	 * Cast the given value to an Accessor. If value is already an Accessor, it is returned
	 * as is. If value is not an Accessor, a resolved Accessor is returned with
	 * value as its resolved value.
	 */
	alia.cast = function(value) {
		return (value instanceof Accessor) ? value : new ValueAccessor(true, value);
	};

	alia.constant = function(value) {
		if (arguments.length === 0) {
			return new ConstantAccessor();
		}
		return new ConstantAccessor(true, value);
	};

	alia.deferred = function(resolver) {
		return new PromiseAccessor(new Promise(resolver));
	};

	alia.future = function(fcn) {
		var args = [];
		for (var i = 1; i < arguments.length; ++i) {
			args.push(arguments[i]);
		}
		return new FutureAccessor(fcn, args);
	};

	alia.join = function() {
		var obj = Object.create(JoinAccessor.prototype);
		JoinAccessor.apply(obj, arguments);
		return obj;
	};

	alia.state = function(value) {
		if (arguments.length === 0) {
			return new ValueAccessor();
		} else if (value instanceof Accessor) {
			var accessor = new ValueAccessor();
			value.observe(function(x) {
				accessor.set(x);
			}, function() {
				accessor._unresolve();
			}, function(err) {
				accessor._throw(err);
			});
			return accessor;
		} else {
			return new ValueAccessor(true, value);
		}
	};

	alia.promise = function(promise) {
		return new PromiseAccessor(promise);
	};

	/**
	 * Like alia.all() but for object properties instead of array items. Returns an
	 * accessor that is resolved when all the properties of the object are resolved.
	 * The accessors's resolved value is an object with resolved values at respective keys
	 * to the original object. If any accessor in the object has an error, the returned
	 * accessor is rejected with the rejection reason.
	 */
	alia.props = function(object) {
		return new ObjectAccessor(object || {});
	};


	// This really should be removed
	alia.getString = function(value) {
		if (value instanceof Bacon.Property) {
			return value.get();
		} else if (typeof value === 'string') {
			return value;
		} else {
			return undefined;
		}
	};

}(Bacon, window.alia = window.alia || {}));