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
