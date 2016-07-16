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
			 * The self URI.
			 *
			 * @public
			 * @property @self
			 * @type String
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
				this['@self'] = this['@self'] || '';
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
			 * Creates it. After that, it will have an URI.
			 *
			 * @public
			 * @method create
			 *
			 * @return Promise The request promise
			 */
			create: function () {
				return $http({
					url: this['@self'],
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
					url: this['@self'],
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
					url: this['@self'],
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
					url: this['@self'],
					method: 'DELETE'
				}).then((function (response) {
					this['@self'] = '';
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
			 *     @self, an URI to itself
			 */
			simplify: function () {
				var simplification = {};
				simplification['@self'] = this['@self'];
				return simplification;
			},
			/**
			 * Desimplifies it from a simple object.
			 *
			 * @public
			 * @method desimplify
			 *
			 * @param {Object} simplification A simple object with the properties:
			 *     @self, an URI to itself
			 */
			desimplify: function (simplification) {
				this['@self'] = simplification['@self'];
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
