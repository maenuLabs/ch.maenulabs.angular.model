/* globals angular */
/**
 * The event module.
 *
 * @module ch.maenulabs.rest.angular.eventify
 */
angular.module('ch.maenulabs.rest.angular.eventify', []);

/* globals angular */
/**
 * The patterns.
 *
 * @module ch.maenulabs.rest.angular.pattern
 * @requires ch.maenulabs.rest.angular.eventify
 */
angular.module('ch.maenulabs.rest.angular.pattern', [
	'ch.maenulabs.rest.angular.eventify'
]);

/* globals angular */
/**
 * The resource.
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
 * Wraps a resource action to emit events.
 *
 * @module ch.maenulabs.rest.angular.eventify
 * @class action
 */
angular.module('ch.maenulabs.rest.angular.eventify').factory('ch.maenulabs.rest.angular.eventify.action', [
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
				$scope.$emit('ch.maenulabs.rest.angular.eventify.action.Pending', action, $scope[resource]);
				$scope[resource][action].apply(resource, arguments).then(function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.eventify.action.Resolved', action, $scope[resource], response);
					deferred.resolve(response);
				}, function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.eventify.action.Rejected', action, $scope[resource], response);
					deferred.reject(response);
				}, function (response) {
					$scope.$emit('ch.maenulabs.rest.angular.eventify.action.Notified', action, $scope[resource], response);
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
 * @module ch.maenulabs.rest.angular.eventify
 * @class change
 */
angular.module('ch.maenulabs.rest.angular.eventify').factory('ch.maenulabs.rest.angular.eventify.change', function () {
	/**
	 * Installs an eventifyer on the specified resource's change in the specified scope.
	 * 
	 * @method change
	 * 
	 * @param {Scope} $scope The scope
	 * @param {String} resource The resource property name
	 * @param {Array<String>} changeables The changeable properties
	 */
	return function ($scope, resource, changeables) {
		changeables = changeables.map(function (changeable) {
			return resource + '.' + changeable;
		});
		return $scope.$watchGroup(changeables, function () {
			$scope.$emit('ch.maenulabs.rest.angular.eventify.change.Changed', $scope[resource]);
		});
	};
});

/* globals angular */
/**
 * Installs a watcher on a resource's validation.
 *
 * @module ch.maenulabs.rest.angular.eventify
 * @class validation
 */
angular.module('ch.maenulabs.rest.angular.eventify').factory('ch.maenulabs.rest.angular.eventify.validation', function () {
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
				$scope.$emit('ch.maenulabs.rest.angular.eventify.validation.Error', $scope[resource]);
			} else {
				$scope.$emit('ch.maenulabs.rest.angular.eventify.validation.Success', $scope[resource]);
			}
		});
	};
});

/* globals angular */
/**
 * Controls the resource create.
 *
 * @module ch.maenulabs.rest.angular.pattern
 * @class create
 */
angular.module('ch.maenulabs.rest.angular.pattern').factory('ch.maenulabs.rest.angular.pattern.create', [
	'ch.maenulabs.rest.angular.eventify.action',
	'ch.maenulabs.rest.angular.eventify.validation',
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
 * @module ch.maenulabs.rest.angular.pattern
 * @class delete
 */
angular.module('ch.maenulabs.rest.angular.pattern').factory('ch.maenulabs.rest.angular.pattern.delete', [
	'ch.maenulabs.rest.angular.eventify.action',
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
 * @module ch.maenulabs.rest.angular.pattern
 * @class read
 */
angular.module('ch.maenulabs.rest.angular.pattern').factory('ch.maenulabs.rest.angular.pattern.read', [
	'ch.maenulabs.rest.angular.eventify.action',
	function (action) {
		return function ($scope, resource) {
			return action($scope, resource, 'read');
		};
	}
]);

/* globals angular */
/**
 * Controls the resource update.
 *
 * @module ch.maenulabs.rest.angular.pattern
 * @class update
 */
angular.module('ch.maenulabs.rest.angular.pattern').factory('ch.maenulabs.rest.angular.pattern.update', [
	'ch.maenulabs.rest.angular.eventify.action',
	'ch.maenulabs.rest.angular.eventify.validation',
	'ch.maenulabs.rest.angular.eventify.change',
	function (action, validation, change) {
		return function ($scope, resource) {
			change($scope, resource);
			validation($scope, resource);
			return action($scope, resource, 'update');
		};
	}
]);

/* globals angular, ch */
/**
 * A basic RESTful resource with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular.resource
 * @class Resource
 * @extends ch.maenulabs.rest.angular.resource.IResource
 */
angular.module('ch.maenulabs.rest.angular.resource').factory('ch.maenulabs.rest.angular.resource.Resource', [
	'$http',
	function ($http) {
		var Validation = ch.maenulabs.validation.Validation;
		return new ch.maenulabs.type.Type(Object, {
			/**
			 * The links mapped by their name.
			 *
			 * @public
			 * @property links
			 * @type Object
			 */
			/**
			 * The validation.
			 *
			 * @protected
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
				this.links = this.links || [];
				this.validation = this.validation || new Validation();
			},
			/**
			 * Checks whether it has errors or not.
			 *
			 * @public
			 * @method hasErrors
			 *
			 * @return Boolean true if it has, false otherwise
			 */
			hasErrors: function () {
				return this.validation.hasErrors(this);
			},
			/**
			 * Gets the validation errors.
			 *
			 * @public
			 * @method getErrors
			 *
			 * @return Object The errors object
			 */
			getErrors: function () {
				return this.validation.getErrors(this);
			},
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
			hasError: function (path) {
				return this.getError(path).length > 0;
			},
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
			getError: function (path) {
				var errors = [this.getErrors()];
				var properties = path.split('.');
				while (properties.length > 0) {
					var property = properties.shift();
					errors = errors.filter(function (error) {
						return error[property];
					}).reduce(function (errors, error) {
						return errors.concat(error[property]);
					}, []);
				}
				return errors;
			},
			/**
			 * Checks whether or not there is a link for the specififed relation.
			 *
			 * @public
			 * @method hasLink
			 *
			 * @param {String} rel The relation to check
			 *
			 * @return Boolean true if it has, false otherwise
			 */
			hasLink: function (rel) {
				return this.links.some(function (link) {
					return link.rel.indexOf(rel) > -1;
				});
			},
			/**
			 * Gets the link for the specififed relation.
			 *
			 * @public
			 * @method getLink
			 *
			 * @param {String} rel The relation to check
			 *
			 * @return String The link
			 */
			getLink: function (rel) {
				return this.links.filter(function (link) {
					return link.rel.indexOf(rel) > -1;
				})[0].href;
			},
			/**
			 * Creates it. After that, it will have an URI.
			 *
			 * @public
			 * @method create
			 *
			 * @return Promise The request promise
			 */
			create: function () {
				return $http({
					url: this.getLink('self'),
					method: 'POST',
					data: this.serialize()
				}).then((function (response) {
					this.deserialize(response.data);
					return response;
				}).bind(this));
			},

			/**
			 * Reads it. Only the URI needs to be set and the rest will be populated.
			 *
			 * @public
			 * @method read
			 *
			 * @return Promise The request promise
			 */
			read: function () {
				return $http({
					url: this.getLink('self'),
					method: 'GET'
				}).then((function (response) {
					this.deserialize(response.data);
					return response;
				}).bind(this));
			},
			/**
			 * Updates it.
			 *
			 * @public
			 * @method update
			 *
			 * @return Promise The request promise
			 */
			update: function () {
				return $http({
					url: this.getLink('self'),
					method: 'PUT',
					data: this.serialize()
				});
			},
			/**
			 * Deletes it.
			 *
			 * @public
			 * @method delete
			 *
			 * @return Promise The request promise
			 */
			'delete': function () {
				return $http({
					url: this.getLink('self'),
					method: 'DELETE'
				}).then((function (response) {
					this.links = [];
					return response;
				}).bind(this));
			},
			/**
			 * Serializes it to a serialization.
			 *
			 * @public
			 * @method serialize
			 *
			 * @return String A serialization
			 */
			serialize: function () {
				return angular.toJson(this.simplify());
			},
			/**
			 * Deserializes it from a serialization.
			 *
			 * @public
			 * @method deserialize
			 *
			 * @param {String} serialization A serialization
			 */
			deserialize: function (serialization) {
				this.desimplify(angular.fromJson(serialization));
			},
			/**
			 * Simplifies it to a simple object.
			 *
			 * @public
			 * @method simplify
			 *
			 * @return Object A simple object with the properties:
			 *     uri, a String, the URI
			 */
			simplify: function () {
				var simplification = {};
				simplification.links = this.links;
				return simplification;
			},
			/**
			 * Desimplifies it from a simple object.
			 *
			 * @public
			 * @method desimplify
			 *
			 * @param {Object} simplification A simple object with the properties:
			 *     uri, a String, the URI
			 */
			desimplify: function (simplification) {
				this.links = simplification.links;
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

/* globals angular, ch */
/**
 * A basic RESTful resource collection with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular.resource
 * @class ResourceCollection
 * @extends ch.maenulabs.rest.angular.resource.Resource
 */
angular.module('ch.maenulabs.rest.angular.resource').factory('ch.maenulabs.rest.angular.resource.ResourceCollection', [
	'ch.maenulabs.rest.angular.resource.Resource',
	function (Resource) {
		var ExistenceCheck = ch.maenulabs.validation.ExistenceCheck;
		var PropertiesCheck = ch.maenulabs.validation.PropertiesCheck;
		return new ch.maenulabs.type.Type(Resource, {
			/**
			 * The resource type.
			 *
			 * @public
			 * @property resourceType
			 * @type ch.maenulabs.type.Type<ch.maenulabs.rest.angular.resource.Resource>
			 */
			/**
			 * The resources.
			 *
			 * @public
			 * @property resources
			 * @type Array<ch.maenulabs.rest.angular.resource.Resource>
			 */
			/**
			 * Creates a resource collection.
			 *
			 * @constructor
			 *
			 * @param {Object} [values={}] A map of initial values 
			 */
			initialize: function (values) {
				this.base('initialize')(values);
				this.resources = this.resources || [];
				this.validation.add(new ExistenceCheck('resources'));
				this.validation.add(new PropertiesCheck([
					'resources'
				], function (resources) {
					if (!resources) {
						return true;
					}
					return !resources.some(function (resource) {
						return resource.hasErrors();
					});
				}, function (resources) {
					return resources.map(function (resource) {
						return resource.getErrors();
					});
				}));
			},
			simplify: function () {
				var simplification = this.base('simplify')();
				simplification.resources = this.resources.map(function (resource) {
					return resource.simplify();
				});
				return simplification;
			},
			desimplify: function (simplification) {
				this.base('desimplify')(simplification);
				this.resources = simplification.resources.map((function (resourceSimplification) {
					return this.resourceType.desimplify(resourceSimplification);
				}).bind(this));
			}
		});
	}
]);

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
	var getUriTemplateBase = function (resourceBaseName, action) {
		return '/' + resourceBaseName + '/' + action;
	};
	var setUriTemplate = function (resourceBaseName, action) {
		var uriTemplateBase = getUriTemplateBase(resourceBaseName, action);
		templates[uriTemplateBase] = uriTemplateBase + '/' + SERIALIZATION_PLACEHOLDER;
	};
	var getUriTemplate = function (resourceBaseName, action) {
		var uriTemplateBase = getUriTemplateBase(resourceBaseName, action);
		return templates[uriTemplateBase];
	};
	/**
	 * Adds the route configuration. Reads the resource if self link exists.
	 * 
	 * @public
	 * @method addRoute
	 * 
	 * @param {String} resourceBaseName The resource base name
	 * @param {String} action The action name
	 * @param {String} resourceTypeName The resource type name
	 * @param {Object} configuration The basic route configuration
	 */
	this.addRoute = function (resourceBaseName, action, resourceTypeName, configuration) {
		if (!configuration.resolve) {
			configuration.resolve = {};
		}
		configuration.resolve.resource = ['$route', resourceTypeName, function ($route, resourceType) {
			var serialization = $route.current.params[SERIALIZATION_KEY];
			if (!serialization) {
				serialization = '{}';
			}
			return resourceType.deserialize(serialization);
		}];
		setUriTemplate(resourceBaseName, action);
		$routeProvider.when(getUriTemplateBase(resourceBaseName, action), configuration);
		$routeProvider.when(getUriTemplate(resourceBaseName, action), configuration);
	};
	this.$get = function () {
		return {
			getUri: function (resourceBaseName, action, resource) {
				return getUriTemplate(resourceBaseName, action).replace(SERIALIZATION_PLACEHOLDER, resource.serialize());
			}
		};
	};
}]);
