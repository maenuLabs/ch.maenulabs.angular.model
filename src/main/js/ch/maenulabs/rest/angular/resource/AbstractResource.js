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
		create: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.getBaseUri(),
				method: 'POST',
				data: this.serialize()
			}).success(angular.bind(this, function (json, status, headers) {
				this.uri = headers('location')
				success.apply(this, arguments);
			})).error(error);
			return this;
		},
		read: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.uri,
				method: 'GET'
			}).success(angular.bind(this, function (json) {
				this.deserialize(json);
				success.apply(this, arguments);
			})).error(error);
			return this;
		},
		update: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.uri,
				method: 'PUT',
				data: this.serialize()
			}).success(success).error(error);
			return this;
		},
		remove: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.uri,
				method: 'DELETE'
			}).success(angular.bind(this, function () {
				this.uri = null;
				success.apply(this, arguments);
			})).error(error);
			return this;
		},
		search: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			var results = [];
			$http({
				url: this.getBaseUri(),
				method: 'GET'
			}).success(angular.bind(this, function (json) {
				var simplifications = angular.fromJson(json);
				for (var i = 0; i < simplifications.length; i = i + 1) {
					results.push(this.type.desimplify(simplifications[i]));
				}
				success.apply(this, arguments);
			})).error(error);
			return results;
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
