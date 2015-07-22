/* globals angular */
/**
 * The model.
 *
 * @module ch.maenulabs.rest.angular
 */
angular.module('ch.maenulabs.rest.angular', [
	'ch.maenulabs.rest.angular.resource'
]);

/* globals angular */
/**
 * The model.
 *
 * @module ch.maenulabs.rest.angular.resource
 */
angular.module('ch.maenulabs.rest.angular.resource', []);

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
		create: function () {
			return $http({
				url: this.getBaseUri(),
				method: 'POST',
				data: this.serialize()
			}).success(angular.bind(this, function (json, status, headers) {
				this.uri = headers('location');
			}));
		},
		read: function () {
			return $http({
				url: this.uri,
				method: 'GET'
			}).success(angular.bind(this, function (json) {
				this.deserialize(json);
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
			}).success(angular.bind(this, function () {
				this.uri = null;
			}));
		},
		search: function () {
			var promise = $http({
				url: this.getSearchUri(),
				method: 'GET'
			});
			promise.results = [];
			return promise.success(angular.bind(this, function (json) {
				var simplifications = angular.fromJson(json);
				for (var i = 0; i < simplifications.length; i = i + 1) {
					promise.results.push(this.type.desimplify(simplifications[i]));
				}
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
		 * Gets the search URI to make request to, without an ending slash. Must
		 * be overwritten in subclass.
		 *
		 * @public
		 * @method getSearchUri
		 *
		 * @return String The search URI
		 */
		getSearchUri: function () {
			throw new Error('not implemented');
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
 * Creates it. After that, it will have an URI.
 *
 * @public
 * @method create
 *
 * @return HttpPromise The request promise
 */
/**
 * Reads it. Only the URI needs to be set and the rest will be populated.
 *
 * @public
 * @method read
 *
 * @return HttpPromise The request promise
 */
/**
 * Updates it.
 *
 * @public
 * @method update
 *
 * @return HttpPromise The request promise
 */
/**
 * Removes it.
 *
 * @public
 * @method remove
 *
 * @return HttpPromise The request promise
 */
/**
 * Searches for similar resources.
 *
 * @public
 * @method search
 *
 * @return HttpPromise The request promise with a results array on it
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
 * @method 
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
