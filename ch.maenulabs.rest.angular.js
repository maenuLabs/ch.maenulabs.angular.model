/* globals angular */
/**
 * The model.
 *
 * @module ch.maenulabs.rest.angular
 */
angular.module('ch.maenulabs.rest.angular', []);

/* globals angular */
/**
 * The event module.
 *
 * @module ch.maenulabs.rest.angular.resource.eventify
 */
angular.module('ch.maenulabs.rest.angular.resource.eventify', []);

/* globals angular */
/**
 * The resource model.
 *
 * @module ch.maenulabs.rest.angular.resource
 */
angular.module('ch.maenulabs.rest.angular.resource', []);

/* globals angular */
/**
 * The patterns.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @requires ch.maenulabs.rest.angular.resource.eventify
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern', [
	'ch.maenulabs.rest.angular.resource.eventify'
]);

/* globals angular, ch */
/**
 * A basic RESTful resource with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular.resource
 * @class AbstractResource
 * @extends ch.maenulabs.rest.angular.resource.IResource
 */
angular.module('ch.maenulabs.rest.angular.resource').factory('ch.maenulabs.rest.angular.resource.AbstractResource', [
	'$http',
	function ($http) {
		var flatten = function (object) {
			var flattened = {};
			for (var key in object) {
				/* istanbul ignore if */
				if (!object.hasOwnProperty(key)) {
					continue;
				}
				var value = object[key];
				if (!(value instanceof Object)) {
					flattened[key] = value;
					continue;
				}
				value = flatten(value);
				for (var subKey in value) {
					/* istanbul ignore if */
					if (!value.hasOwnProperty(subKey)) {
						continue;
					}
					flattened[key + '.' + subKey] = value[subKey];
				}
			}
			return flattened;
		};
		var Validation = ch.maenulabs.validation.Validation;
		return new ch.maenulabs.type.Type(Object, {
			/**
			 * The URI.
			 *
			 * @public
			 * @property uri
			 * @type String
			 */
			/**
			 * The validation.
			 *
			 * @public
			 * @property validation
			 * @type Validation
			 */
			/**
			 * Creates a resource.
			 *
			 * @constructor
			 *
			 * @param {Object} [values={}] A map of initial values 
			 */
			initialize: function (values) {
				angular.extend(this, values || {});
				this.validation = this.validation || new Validation();
			},
			hasErrors: function () {
				return this.validation.hasErrors(this);
			},
			getErrors: function () {
				return this.validation.getErrors(this);
			},
			hasError: function (property) {
				var errors = this.validation.getErrors(this);
				return errors[property] && errors[property].length > 0;
			},
			getError: function (property) {
				return this.validation.getErrors(this)[property] || [];
			},
			getChangeables: function () {
				throw new Error('not implemented');
			},
			create: function () {
				return $http({
					url: this.getBaseUri(),
					method: 'POST',
					data: this.serialize()
				}).then((function (response) {
					this.uri = response.headers('location');
					return response;
				}).bind(this));
			},
			read: function () {
				return $http({
					url: this.uri,
					method: 'GET'
				}).then((function (response) {
					this.deserialize(response.data);
					return response;
				}).bind(this));
			},
			update: function () {
				return $http({
					url: this.uri,
					method: 'PUT',
					data: this.serialize()
				});
			},
			'delete': function () {
				return $http({
					url: this.uri,
					method: 'DELETE'
				}).then((function (response) {
					this.uri = null;
					return response;
				}).bind(this));
			},
			search: function () {
				return $http({
					url: this.getSearchUri(),
					method: 'GET'
				}).then((function (response) {
					var simplifications = angular.fromJson(response.data);
					response.results = [];
					for (var i = 0; i < simplifications.length; i = i + 1) {
						response.results.push(this.type.desimplify(simplifications[i]));
					}
					return response;
				}).bind(this));
			},
			serialize: function () {
				return angular.toJson(this.simplify());
			},
			deserialize: function (serialization) {
				this.desimplify(angular.fromJson(serialization));
			},
			simplify: function () {
				return {
					uri: this.uri
				};
			},
			desimplify: function (simplification) {
				this.uri = simplification.uri;
			},
			getBaseName: function () {
				throw new Error('not implemented');
			},
			/**
			 * Gets the base URI to make request to, without an ending slash. Must
			 * be overwritten in subclass.
			 *
			 * @public
			 * @method getBaseUri
			 *
			 * @return String The base URI
			 */
			getBaseUri: function () {
				throw new Error('not implemented');
			},
			/**
			 * Gets the search URI to make request to, without an ending slash.
			 *
			 * @public
			 * @method getSearchUri
			 *
			 * @return String The search URI
			 */
			getSearchUri: function () {
				return this.getBaseUri() + '?' + this.toSearchParameters();
			},
			/**
			 * Encodes itself as search parameters.
			 *
			 * @protected
			 * @method toSearchParameters
			 *
			 * @return String The search parameters
			 */
			toSearchParameters: function () {
				var items = [];
				var flattened = flatten(this.simplify());
				for (var key in flattened) {
					var value = flattened[key];
					if (value == null) {
						continue;
					}
					var item = encodeURIComponent(key) + '=' + encodeURIComponent(value);
					items.push(item);
				}
				return items.join('&');
			}
		}, {
			/**
			 * Creates a resource from a serialization.
			 *
			 * @public
			 * @static
			 * @method deserialize
			 *
			 * @param {String} serialization A serialization, see desimplify for
			 *     properties
			 *
			 * @return IResource The resource that was created from the specified serialization
			 */
			deserialize: function (serialization) {
				var resource = new this();
				resource.deserialize(serialization);
				return resource;
			},
			/**
			 * Creates a resource from a simplification.
			 *
			 * @public
			 * @static
			 * @method desimplify
			 *
			 * @param {Object} simplification A simplification, see desimplify for
			 *     properties
			 *
			 * @return IResource The resource that was created from the specified
			 *     simplification
			 */
			desimplify: function (simplification) {
				var resource = new this();
				resource.desimplify(simplification);
				return resource;
			}
		});
	}
]);

/**
 * A basic RESTful resource with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular.resource
 * @class IResource
 */
/**
 * Checks whether it has errors or not.
 *
 * @public
 * @method hasErrors
 *
 * @return Boolean true if it has, false otherwise
 */
/**
 * Gets the validation errors.
 *
 * @public
 * @method getErrors
 *
 * @return Object The errors object
 */
/**
 * Checks whether or not there is an error with the specified property.
 *
 * @public
 * @method hasError
 *
 * @param {String} property The property to check
 *
 * @return Boolean true if it has, false otherwise
 */
/**
 * Gets the validation error for the specified property.
 *
 * @public
 * @method getError
 *
 * @param {String} property The property to check
 *
 * @return Array The error messages
 */
/**
 * Gets the names of the properties that can change.
 *
 * @public
 * @method getChangeables
 *
 * @return Array The property names
 */
/**
 * Creates it. After that, it will have an URI.
 *
 * @public
 * @method create
 *
 * @return Promise The request promise
 */
/**
 * Reads it. Only the URI needs to be set and the rest will be populated.
 *
 * @public
 * @method read
 *
 * @return Promise The request promise
 */
/**
 * Updates it.
 *
 * @public
 * @method update
 *
 * @return Promise The request promise
 */
/**
 * Deletes it.
 *
 * @public
 * @method delete
 *
 * @return Promise The request promise
 */
/**
 * Searches for similar resources.
 *
 * @public
 * @method search
 *
 * @return Promise The request promise with a results array on it
 */
/**
 * Serializes it to a serialization.
 *
 * @public
 * @method serialize
 *
 * @return String A serialization
 */
/**
 * Deserializes it from a serialization.
 *
 * @public
 * @method deserialize
 *
 * @param {String} serialization A serialization
 */
/**
 * Simplifies it to a simple object.
 *
 * @public
 * @method simplify
 *
 * @return Object A simple object with the properties:
 *     uri, a String, the URI
 */
/**
 * Desimplifies it from a simple object.
 *
 * @public
 * @method desimplify
 *
 * @param {Object} simplification A simple object with the properties:
 *     uri, a String, the URI
 */
/**
 * Get the base name of the resource.
 * 
 * @public
 * @method getBaseName
 * 
 * @return String The name
 */

/* globals angular */
/**
 * Wraps a resource action to emit events.
 *
 * @module ch.maenulabs.rest.angular.resource.eventify
 * @class action
 */
angular.module('ch.maenulabs.rest.angular.resource.eventify').factory('ch.maenulabs.rest.angular.resource.eventify.action', [
	'$q',
	function ($q) {
		/**
		 * Installs an eventifyer on the action on the specified resource in the specified scope to emit events on pending, success and error.
		 * 
		 * @method action
		 * 
		 * @param {Scope} $scope The scope
		 * @param {String} resource The resource property name
		 * @param {String} action The action name to perform
		 * 
		 * @return {Function} Returns a promise, resolved on success or rejected on error.
		 *     Arguments are passed on to the wrapped function.
		 */
		return function ($scope, resource, action) {
			return function () {
				var deferred = $q.defer();
				$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.action.Pending', action, $scope[resource]);
				$scope[resource][action].apply(resource, arguments).then(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.action.Resolved', action, $scope[resource], response);
					deferred.resolve(response);
				}, function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.action.Rejected', action, $scope[resource], response);
					deferred.reject(response);
				}, function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.action.Notified', action, $scope[resource], response);
					deferred.notify(response);
				});
				return deferred.promise;
			};
		};
	}
]);

/* globals angular */
/**
 * Installs a watcher on a resource's changes.
 *
 * @module ch.maenulabs.rest.angular.resource.eventify
 * @class change
 */
angular.module('ch.maenulabs.rest.angular.resource.eventify').factory('ch.maenulabs.rest.angular.resource.eventify.change', function () {
	/**
	 * Installs an eventifyer on the specified resource's change in the specified scope.
	 * 
	 * @method change
	 * 
	 * @param {Scope} $scope The scope
	 * @param {String} resource The resource property name
	 */
	return function ($scope, resource) {
		var unwatchResource = angular.noop;
		var unwatchChangeables = angular.noop;
		var unwatch = function () {
			unwatchResource();
			unwatchChangeables();
			unwatchResource = angular.noop;
			unwatchChangeables = angular.noop;
		};
		unwatchResource = $scope.$watch(resource, function (newValue, oldValue) {
			if (newValue != oldValue) {
				unwatchChangeables();
			}
			var changeables = newValue.getChangeables().map(function (changeable) {
				return resource + '.' + changeable;
			});
			unwatchChangeables = $scope.$watchGroup(changeables, function () {
				$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.change.Changed', $scope[resource]);
			});
		});
		return unwatch;
	};
});

/* globals angular */
/**
 * Installs a watcher on a resource's validation.
 *
 * @module ch.maenulabs.rest.angular.resource.eventify
 * @class validation
 */
angular.module('ch.maenulabs.rest.angular.resource.eventify').factory('ch.maenulabs.rest.angular.resource.eventify.validation', function () {
	/**
	 * Installs an eventifyer on the specified resource's validation in the specified scope.
	 * 
	 * @method validation
	 * 
	 * @param {Scope} $scope The scope
	 * @param {String} resource The resource property name
	 */
	return function ($scope, resource) {
		return $scope.$watch(resource + '.hasErrors()', function (hasErrors) {
			if (hasErrors) {
				$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.validation.Error', $scope[resource]);
			} else {
				$scope.$emit('ch.maenulabs.rest.angular.resource.eventify.validation.Success', $scope[resource]);
			}
		});
	};
});

/* globals angular */
/**
 * Controls the resource create.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @class create
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern').factory('ch.maenulabs.rest.angular.resource.pattern.create', [
	'ch.maenulabs.rest.angular.resource.eventify.action',
	'ch.maenulabs.rest.angular.resource.eventify.validation',
	function (action, validation) {
		return function ($scope, resource) {
			validation($scope, resource);
			return action($scope, resource, 'create');
		};
	}
]);

/* globals angular */
/**
 * Controls the resource delete.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @class delete
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern').factory('ch.maenulabs.rest.angular.resource.pattern.delete', [
	'ch.maenulabs.rest.angular.resource.eventify.action',
	function (action) {
		return function ($scope, resource) {
			return action($scope, resource, 'delete');
		};
	}
]);

/* globals angular */
/**
 * Controls the resource read.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @class read
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern').factory('ch.maenulabs.rest.angular.resource.pattern.read', [
	'ch.maenulabs.rest.angular.resource.eventify.action',
	function (action) {
		return function ($scope, resource) {
			return action($scope, resource, 'read');
		};
	}
]);

/* globals angular */
/**
 * Controls the resource search.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @class search
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern').factory('ch.maenulabs.rest.angular.resource.pattern.search', [
	'$timeout',
	'ch.maenulabs.rest.angular.resource.eventify.action',
	'ch.maenulabs.rest.angular.resource.eventify.change',
	function ($timeout, action, change) {
		return function ($scope, resource, delay) {
			return function () {
				var scheduled = undefined;
				var unwatchChange = angular.noop;
				var unwatchChanged = angular.noop;
				var unwatch = function () {
					unwatchChange();
					unwatchChanged();
					unwatchChange = angular.noop;
					unwatchChanged = angular.noop;
				};
				var search = action($scope, resource, 'search');
				unwatchChange = change($scope, resource);
				unwatchChanged = $scope.$on('ch.maenulabs.rest.angular.resource.eventify.change.Changed', function ($event, candidate) {
					if (candidate != $scope[resource]) {
						return;
					}
					if (scheduled) {
						$timeout.cancel(scheduled);
					}
					scheduled = $timeout(delay);
					scheduled.then(function () {
						scheduled = undefined;
						search();
					});
				});
				return unwatch;
			};
		};
	}
]);

/* globals angular */
/**
 * Controls the resource update.
 *
 * @module ch.maenulabs.rest.angular.resource.pattern
 * @class update
 */
angular.module('ch.maenulabs.rest.angular.resource.pattern').factory('ch.maenulabs.rest.angular.resource.pattern.update', [
	'ch.maenulabs.rest.angular.resource.eventify.action',
	'ch.maenulabs.rest.angular.resource.eventify.validation',
	'ch.maenulabs.rest.angular.resource.eventify.change',
	function (action, validation, change) {
		return function ($scope, resource) {
			change($scope, resource);
			validation($scope, resource);
			return action($scope, resource, 'update');
		};
	}
]);
