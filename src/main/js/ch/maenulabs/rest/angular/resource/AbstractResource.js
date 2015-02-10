/* globals angular, ch */
/**
 * A basic RESTful resource with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular.resource
 * @class AbstractResource
 * @extends IResource
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
		 * @param String property The property to check
		 *
		 * @return Boolean true if it has, false otherwise
		 */
		hasError: function (property) {
			var errors = this.validation.getErrors(this);
			return errors[property] && errors[property].length > 0;
		},
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
		getError: function (property) {
			return this.validation.getErrors(this)[property] || [];
		},
		/**
		 * Creates it. After that, it will have an URI.
		 *
		 * @public
		 * @method create
		 *
		 * @param Function [success] Called when successful
		 * @param Function [error] Called when unsuccessful
		 *
		 * @return IResource itself
		 */
		create: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.getBaseUri(),
				method: 'POST',
				data: this.toJson()
			}).success(angular.bind(this, function (json, status, headers) {
				this.uri = headers('location')
				success.apply(this, arguments);
			})).error(error);
			return this;
		},
		/**
		 * Reads it. Only the URI needs to be set and the rest will be populated.
		 *
		 * @public
		 * @method read
		 *
		 * @param Function [success] Called when successful
		 * @param Function [error] Called when unsuccessful
		 *
		 * @return IResource itself
		 */
		read: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.uri,
				method: 'GET'
			}).success(angular.bind(this, function (json) {
				this.fromJson(json);
				success.apply(this, arguments);
			})).error(error);
			return this;
		},
		/**
		 * Updates it.
		 *
		 * @public
		 * @method update
		 *
		 * @param Function [success] Called when successful
		 * @param Function [error] Called when unsuccessful
		 *
		 * @return IResource itself
		 */
		update: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.uri,
				method: 'PUT',
				data: this.toJson()
			}).success(success).error(error);
			return this;
		},
		/**
		 * Removes it.
		 *
		 * @public
		 * @method remove
		 *
		 * @param Function [success] Called when successful
		 * @param Function [error] Called when unsuccessful
		 *
		 * @return IResource itself
		 */
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
		/**
		 * Searches for similar resources.
		 *
		 * @public
		 * @method search
		 *
		 * @param Function [success] Called when successful
		 * @param Function [error] Called when unsuccessful
		 *
		 * @return Array The resulting resources
		 */
		search: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			var results = [];
			$http({
				url: this.getBaseUri(),
				method: 'GET'
			}).success(angular.bind(this, function (json) {
				var jsons = angular.fromJson(json);
				for (var i = 0; i < jsons.length; i = i + 1) {
					results.push(this.type.fromJson(jsons[i]));
				}
				success.apply(this, arguments);
			})).error(error);
			return results;
		},
		/**
		 * Serializes it to a JSON string.
		 *
		 * @public
		 * @method toJson
		 *
		 * @return String A JSON string
		 */
		toJson: function () {
			return angular.toJson(this.toSerializable());
		},
		/**
		 * Deserializes it from a JSON string.
		 *
		 * @public
		 * @method fromJson
		 *
		 * @param String json A JSON string
		 */
		fromJson: function (json) {
			this.fromSerializable(angular.fromJson(json));
		},
		/**
		 * Serializes it to a simple serializable object.
		 *
		 * @public
		 * @method toSerializable
		 *
		 * @return Object A simple object with the properties:
		 *     uri, a String
		 */
		toSerializable: function () {
			return {
				uri: this.uri
			};
		},
		/**
		 * Deserializes it from a simple serializable object.
		 *
		 * @public
		 * @method fromSerializable
		 *
		 * @param Object serializable A simple object with the properties:
		 *     uri, a String
		 */
		fromSerializable: function (serializable) {
			this.uri = serializable.uri;
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
		 * Creates a resource from a JSON.
		 *
		 * @public
		 * @static
		 * @method fromJson
		 *
		 * @param String json A JSON string, see fromSerializable for
		 *     properties
		 *
		 * @return IResource The resource that was created from the specified JSON
		 */
		fromJson: function (json) {
			var resource = new this();
			resource.fromJson(json);
			return resource;
		},
		/**
		 * Creates a resource from a serializable object.
		 *
		 * @public
		 * @static
		 * @method fromSerializable
		 *
		 * @param Object serializable A serializable object, see
		 *     fromSerializable for properties
		 *
		 * @return IResource The resource that was created from the specified
		 *     serializable
		 */
		fromSerializable: function (serializable) {
			var resource = new this();
			resource.fromSerializable(serializable);
			return resource;
		}
	});
}]);
