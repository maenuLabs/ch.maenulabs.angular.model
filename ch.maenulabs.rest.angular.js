/* globals angular */
/**
 * The controller.
 *
 * @module ch.maenulabs.rest.angular.controller
 */
angular.module('ch.maenulabs.rest.angular.controller', []);

/* globals angular */
/**
 * The model.
 *
 * @module ch.maenulabs.rest.angular
 */
angular.module('ch.maenulabs.rest.angular', [
	'ch.maenulabs.rest.angular.resource',
	'ch.maenulabs.rest.angular.controller'
]);

/* globals angular */
/**
 * The resource model.
 *
 * @module ch.maenulabs.rest.angular.resource
 */
angular.module('ch.maenulabs.rest.angular.resource', []);

/* globals angular */
/**
 * Controls the resource create.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class CreateFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.CreateFactory', function () {
	return [
		'$scope', 'resource', function ($scope, resource) {
			$scope.resource = resource;
			$scope.$watch('resource.hasErrors()', function (hasErrors) {
				if (!hasErrors) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.validation.Success', $scope.resource);
				} else {
					$scope.$emit('ch.maenulabs.rest.angular.controller.validation.Error', $scope.resource);
				}
			});
			$scope.create = function () {
				$scope.resource.create().then(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.create.Success', $scope.resource, response);
				}).catch(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.create.Error', $scope.resource, response);
				});
			};
		}
	];
});

/* globals angular */
/**
 * Controls the resource read.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class ReadFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.ReadFactory', function () {
	return [
		'$scope', 'resource', function ($scope, resource) {
			$scope.resource = resource;
		}
	];
});

/* globals angular, ch */
/**
 * Controls the resource search.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class SearchFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.SearchFactory', [
	'$timeout', '$q', function ($timeout, $q) {
		var SearchEvent = ch.maenulabs.type.Type(Object, {
			delay: null,
			state: null,
			promise: null,
			initialize: function (delay) {
				this.delay = delay;
				this.state = this.type.INITIALIZED;
				this.promise = $q.defer().promise;
			},
			schedule: function (search) {
				this.state = this.type.SCHEDULED;
				var deferred = $q.defer();
				this.promise = $timeout(angular.bind(this, function () {
					return search().then(angular.bind(this, function (response) {
						this.state = this.type.SUCCESS;
						deferred.resolve(response);
						return response;
					})).catch(angular.bind(this, function (response) {
						this.state = this.type.ERROR;
						deferred.reject(response);
						return response;
					}));
				}), this.delay);
				this.promise.catch(angular.bind(this, function (response) {
					this.state = this.type.CANCELLED;
					deferred.reject(response);
					return response;
				}));
				return deferred.promise;
			},
			cancel: function () {
				$timeout.cancel(this.promise);
			}
		}, {
			INITIALIZED: 1,
			SCHEDULED: 2,
			CANCELLED: 3,
			SUCCESS: 4,
			ERROR: 5
		});
		var DELAY = 1000;
		return [
			'$scope', 'resource', function ($scope, resource) {
				$scope.resource = resource;
				$scope.currentSearchEvent = new SearchEvent(DELAY);
				$scope.search = function () {
					$scope.currentSearchEvent.cancel();
					$scope.currentSearchEvent = new SearchEvent(DELAY);
					$scope.currentSearchEvent.schedule($scope.resource.search).then(function (response) {
						$scope.$emit('ch.maenulabs.rest.angular.controller.search.Success', $scope.currentSearchEvent, $scope.resource, response);
						return response;
					}).catch(function (response) {
						$scope.$emit('ch.maenulabs.rest.angular.controller.search.Error', $scope.currentSearchEvent, $scope.resource, response);
						return response;
					});
					$scope.$emit('ch.maenulabs.rest.angular.controller.search.Pending', $scope.currentSearchEvent, $scope.resource);
				};
				$scope.$watchGroup($scope.resource.getChangeables(), $scope.search);
			}
		];
	}
]);

/* globals angular */
/**
 * Controls the resource update.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class UpdateFactory
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.UpdateFactory', function () {
	return [
		'$scope', 'resource', function ($scope, resource) {
			$scope.resource = resource;
			$scope.$watchGroup($scope.resource.getChangeables(), function () {
				$scope.$emit('ch.maenulabs.rest.angular.controller.Change', $scope.resource);
			});
			$scope.$watch('resource.hasErrors()', function (hasErrors) {
				if (hasErrors) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.validation.Error', $scope.resource);
				} else {
					$scope.$emit('ch.maenulabs.rest.angular.controller.validation.Success', $scope.resource);
				}
			});
			$scope.update = function () {
				$scope.resource.update().then(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.update.Success', $scope.resource, response);
				}).catch(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.controller.update.Error', $scope.resource, response);
				});
			};
		}
	];
});

/* globals angular, ch */
/**
 * A basic RESTful resource with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular.resource
 * @class AbstractResource
 * @extends ch.maenulabs.rest.angular.resource.IResource
 */
angular.module('ch.maenulabs.rest.angular.resource').factory('ch.maenulabs.rest.angular.resource.AbstractResource',
		['$http', function ($http) {
	var flatten = function (object) {
		var flattened = {};
		for (var key in object) {
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
		 * @param Object [values={}] A map of initial values 
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
			}).then(angular.bind(this, function (response) {
				this.uri = response.headers('location');
				return response;
			}));
		},
		read: function () {
			return $http({
				url: this.uri,
				method: 'GET'
			}).then(angular.bind(this, function (response) {
				this.deserialize(response.data);
				return response;
			}));
		},
		update: function () {
			return $http({
				url: this.uri,
				method: 'PUT',
				data: this.serialize()
			});
		},
		remove: function () {
			$http({
				url: this.uri,
				method: 'DELETE'
			}).then(angular.bind(this, function (response) {
				this.uri = null;
				return response;
			}));
		},
		search: function () {
			var promise = $http({
				url: this.getSearchUri(),
				method: 'GET'
			});
			return promise.then(angular.bind(this, function (response) {
				var simplifications = angular.fromJson(response.data);
				response.results = [];
				for (var i = 0; i < simplifications.length; i = i + 1) {
					response.results.push(this.type.desimplify(simplifications[i]));
				}
				return response;
			}));
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
		 * @param String serialization A serialization, see desimplify for
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
		 * @param Object simplification A simplification, see desimplify for
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
}]);

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
 * @param String property The property to check
 *
 * @return Boolean true if it has, false otherwise
 */
/**
 * Gets the validation error for the specified property.
 *
 * @public
 * @method getError
 *
 * @param String property The property to check
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
 * Removes it.
 *
 * @public
 * @method remove
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
 * @param String serialization A serialization
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
 * @param Object simplification A simple object with the properties:
 *     uri, a String, the URI
 */
