/* globals angular */
/**
 * The controller decorator.
 *
 * @module ch.maenulabs.rest.angular.controller.decorator
 * @requires ch.maenulabs.rest.angular.controller
 */
angular.module('ch.maenulabs.rest.angular.controller.decorator', [
	'ch.maenulabs.rest.angular.controller'
]);

/* globals angular */
/**
 * The controller.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @requires ch.maenulabs.rest.angular.event
 */
angular.module('ch.maenulabs.rest.angular.controller', [
	'ch.maenulabs.rest.angular.event'
]);

/* globals angular */
/**
 * The event module.
 *
 * @module ch.maenulabs.rest.angular.event
 * @requires ch.maenulabs.rest.angular.resource
 */
angular.module('ch.maenulabs.rest.angular.event', [
	'ch.maenulabs.rest.angular.resource'
]);

/* globals angular */
/**
 * The model.
 *
 * @module ch.maenulabs.rest.angular
 */
angular.module('ch.maenulabs.rest.angular', []);

/* globals angular */
/**
 * The resource model.
 *
 * @module ch.maenulabs.rest.angular.resource
 */
angular.module('ch.maenulabs.rest.angular.resource', []);

/* globals angular */
/**
 * The router.
 *
 * @module ch.maenulabs.rest.angular.router
 */
angular.module('ch.maenulabs.rest.angular.router', [
	'ngRoute',
	'ch.maenulabs.rest.angular.resource'
]);

/* globals angular */
/**
 * Controls the resource create.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Create
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.Create', [
	'ch.maenulabs.rest.angular.event.eventifyAction',
	'ch.maenulabs.rest.angular.event.eventifyValidation',
	function (eventifyAction, eventifyValidation) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				this.resource = resource;
				eventifyValidation($scope, this.resource);
				this.create = eventifyAction($scope, this.resource, 'create');
			}
		];
	}
]);

/* globals angular */
/**
 * Controls the resource delete.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Delete
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.Delete', [
	'ch.maenulabs.rest.angular.event.eventifyAction',
	function (eventifyAction) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				this.resource = resource;
				this.delete = eventifyAction($scope, this.resource, 'delete');
			}
		];
	}
]);

/* globals angular */
/**
 * Controls the resource read.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Read
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.Read', [
	'ch.maenulabs.rest.angular.event.eventifyAction',
	function (eventifyAction) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				this.resource = resource;
				this.read = eventifyAction($scope, this.resource, 'read');
			}
		];
	}
]);

/* globals angular */
/**
 * Controls the resource search.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Search
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.Search', [
	'ch.maenulabs.rest.angular.event.eventifyAction',
	'ch.maenulabs.rest.angular.event.eventifyChange',
	'ch.maenulabs.rest.angular.event.eventifySchedule',
	function (eventifyAction, eventifyChange, eventifySchedule) {
		return [
			'$scope',
			'resource',
			'delay',
			function ($scope, resource, delay) {
				this.cancel = function () {};
				this.resource = resource;
				this.search = eventifyAction($scope, this.resource, 'search');
				$scope.$on('ch.maenulabs.rest.angular.resource.Changed', (function ($event, resource) {
					if (resource != this.resource) {
						return;
					}
					this.cancel();
					this.cancel = eventifySchedule($scope, delay);
				}).bind(this));
				$scope.$on('ch.maenulabs.rest.angular.event.schedule.Done', (function ($event, cancel) {
					if (cancel != this.cancel) {
						return;
					}
					this.cancel = function () {};
					this.search();
				}).bind(this));
				eventifyChange($scope, this.resource);
			}
		];
	}
]);

/* globals angular */
/**
 * Controls the resource update.
 *
 * @module ch.maenulabs.rest.angular.controller
 * @class Update
 */
angular.module('ch.maenulabs.rest.angular.controller').factory('ch.maenulabs.rest.angular.controller.Update', [
	'ch.maenulabs.rest.angular.event.eventifyAction',
	'ch.maenulabs.rest.angular.event.eventifyValidation',
	'ch.maenulabs.rest.angular.event.eventifyChange',
	function (eventifyAction, eventifyValidation, eventifyChange) {
		return [
			'$scope',
			'resource',
			function ($scope, resource) {
				this.resource = resource;
				eventifyChange($scope, this.resource);
				eventifyValidation($scope, this.resource);
				this.update = eventifyAction($scope, this.resource, 'update');
			}
		];
}]);

/* globals angular */
/**
 * Decorator for $controller that instantiates generic controllers.
 * Set controller like 'Create'.
 * Requires resource on the scope and injects it into the controller.
 *
 * @module ch.maenulabs.rest.angular.controller.decorator
 * @class decorator
 */
angular.module('ch.maenulabs.rest.angular.controller.decorator').decorator('$controller', ['$injector', '$parse', '$delegate', function ($injector, $parse, $delegate) {
	var CONTROLLER_REGEX = /^([^\(\s]+)(\(([^\)]*)\))?(\s+as\s+(\w+))?$/;
	return function (expression, locals, later, identifier) {
		try {
			return $delegate.apply(this, arguments);
		} catch (error) {
			var match = expression.match(CONTROLLER_REGEX);
			// get controller
			var controllerParts = match[1].split('.');
			var actionName = controllerParts[controllerParts.length - 1];
			var controller = $injector.get('ch.maenulabs.rest.angular.controller.' + actionName);
			// get locals.resource
			if (match[3]) {
				locals.resource = $parse(match[3])(locals.$scope);
			}
			// get identifier
			if (match[5] && !identifier) {
				identifier = match[5];
			}
			return $delegate.apply(this, [controller, locals, later, identifier]);
		}
	};
}]);

/* globals angular */
/**
 * Wraps a resource action to emit events.
 *
 * @module ch.maenulabs.rest.angular.event
 * @class eventifyAction
 */
angular.module('ch.maenulabs.rest.angular.event').factory('ch.maenulabs.rest.angular.event.eventifyAction', function () {
	/**
	 * Installs an eventifyer on the action on the specified resource in the specified scope to emit events on pending, success and error.
	 * 
	 * @method eventifyAction
	 * 
	 * @param {Scope} $scope The scope
	 * @param {IResource} resource The resource
	 * @param {String} action The action name to perform
	 * 
	 * @return {Function} Returns a promise, resolved on success or rejected on error.
	 *     Arguments are passed on to the wrapped function.
	 */
	return function ($scope, resource, action) {
		return function () {
			$scope.$emit('ch.maenulabs.rest.angular.resource.' + action + '.Pending', resource);
			return resource[action].apply(resource, arguments).then(function (response) {
				$scope.$emit('ch.maenulabs.rest.angular.resource.' + action + '.Success', resource, response);
				return response;
			}).catch(function (response) {
				$scope.$emit('ch.maenulabs.rest.angular.resource.' + action + '.Error', resource, response);
				return response;
			});
		};
	};
});

/* globals angular */
/**
 * Installs a watcher on a resource's changes.
 *
 * @module ch.maenulabs.rest.angular.event
 * @class eventifyChange
 */
angular.module('ch.maenulabs.rest.angular.event').factory('ch.maenulabs.rest.angular.event.eventifyChange', function () {
	/**
	 * Installs an eventifyer on the specified resource's change in the specified scope.
	 * 
	 * @method eventifyChange
	 * 
	 * @param {Scope} $scope The scope
	 * @param {IResource} resource The resource property name
	 */
	return function ($scope, resource) {
		return $scope.$watchGroup(resource.getChangeables(), function () {
			$scope.$emit('ch.maenulabs.rest.angular.resource.Changed', resource);
		});
	};
});

/* globals angular */
/**
 * Installs an eventifyer on a scheduled action.
 *
 * @module ch.maenulabs.rest.angular.event
 * @class eventifySchedule
 */
angular.module('ch.maenulabs.rest.angular.event').factory('ch.maenulabs.rest.angular.event.eventifySchedule', [
	'$timeout',
	function ($timeout) {
		/**
		 * Installs an eventifyer on a scheduled action in the specified scope.
		 * 
		 * @method eventifySchedule
		 * 
		 * @param {Scope} $scope The scope
		 * @param {Number} delay The delay in milliseconds
		 * 
		 * @return {Function} Cancels the promise
		 */
		return function ($scope, delay) {
			var promise = $timeout(angular.noop, delay);
			var cancel = function () {
				return $timeout.cancel(promise);
			};
			$scope.$emit('ch.maenulabs.rest.angular.event.schedule.Scheduled', cancel);
			promise.then(function (response) {
				$scope.$emit('ch.maenulabs.rest.angular.event.schedule.Done', cancel);
				return response;
			}).catch(function (response) {
				$scope.$emit('ch.maenulabs.rest.angular.event.schedule.Cancelled', cancel);
				return response;
			});
			return cancel;
		};
	}
]);

/* globals angular */
/**
 * Installs a watcher on a resource's validation.
 *
 * @module ch.maenulabs.rest.angular.event
 * @class eventifyValidation
 */
angular.module('ch.maenulabs.rest.angular.event').factory('ch.maenulabs.rest.angular.event.eventifyValidation', function () {
	/**
	 * Installs an eventifyer on the specified resource's validation in the specified scope.
	 * 
	 * @method eventifyValidation
	 * 
	 * @param {Scope} $scope The scope
	 * @param {IResource} resource The resource property name
	 */
	return function ($scope, resource) {
		return $scope.$watch(function () {
			return resource.hasErrors();
		}, function (hasErrors) {
			if (hasErrors) {
				$scope.$emit('ch.maenulabs.rest.angular.resource.validation.Error', resource);
			} else {
				$scope.$emit('ch.maenulabs.rest.angular.resource.validation.Success', resource);
			}
		});
	};
});

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
 * Routes client URIs.
 *
 * @module ch.maenulabs.rest.angular.router
 * @class router
 */
angular.module('ch.maenulabs.rest.angular.router').provider('ch.maenulabs.rest.angular.router.router', ['$routeProvider', function ($routeProvider) {
	var SERIALIZATION_KEY = 'serialization';
	var SERIALIZATION_PLACEHOLDER = ':' + SERIALIZATION_KEY + '*';
	var templates = {};
	var getUriTemplateKey = function (resourceBaseName, action) {
		return resourceBaseName + '/' + action;
	};
	var setUriTemplate = function (resourceBaseName, action) {
		templates[getUriTemplateKey(resourceBaseName, action)] = '/' + resourceBaseName + '/' + action + '/' + SERIALIZATION_PLACEHOLDER;
	};
	var getUriTemplate = function (resourceBaseName, action) {
		return templates[getUriTemplateKey(resourceBaseName, action)];
	};
	/**
	 * Adds the route configuration. Reads the resource if URI exists.
	 * 
	 * @public
	 * @method addRoute
	 * 
	 * @param {String} resourceBaseName The resource base name
	 * @param {String} resourceTypeName The resource type name
	 * @param {String} action The action name
	 * @param {Object} configuration The basic route configuration
	 */
	this.addRoute = function (resourceBaseName, resourceTypeName, action, configuration) {
		if (!configuration.resolve) {
			configuration.resolve = {};
		}
		configuration.resolve.resource = ['$route', resourceTypeName, function ($route, resourceType) {
			var serialization = $route.current.params[SERIALIZATION_KEY];
			if (!serialization) {
				serialization = {};
			}
			var resource = resourceType.deserialize(serialization);
			if (!resource.uri) {
				return resource;
			}
			return resource.read().then(function () {
				return resource;
			});
		}];
		setUriTemplate(resourceBaseName, action);
		$routeProvider.when(getUriTemplate(resourceBaseName, action), configuration);
	};
	this.$get = function () {
		return {
			getUri: function (resource, action) {
				return getUriTemplate(resource.getBaseName(), action).replace(SERIALIZATION_PLACEHOLDER, resource.serialize());
			}
		};
	};
}]);
