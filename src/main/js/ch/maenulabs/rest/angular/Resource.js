/* globals angular, ch */
/**
 * A basic RESTful resource with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular
 * @class Resource
 * @extends ch.maenulabs.rest.angular.IResource
 */
angular.module('ch.maenulabs.rest.angular').factory('ch.maenulabs.rest.angular.Resource', [
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
			hasErrors: function () {
				return this.validation.hasErrors(this);
			},
			getErrors: function () {
				return this.validation.getErrors(this);
			},
			hasError: function (path) {
				return this.getError(path).length > 0;
			},
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
			hasLink: function (rel) {
				return this.links.some(function (link) {
					return link.rel.indexOf(rel) > -1;
				});
			},
			getLink: function (rel) {
				return this.links.filter(function (link) {
					return link.rel.indexOf(rel) > -1;
				})[0].href;
			},
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
			read: function () {
				return $http({
					url: this.getLink('self'),
					method: 'GET'
				}).then((function (response) {
					this.deserialize(response.data);
					return response;
				}).bind(this));
			},
			update: function () {
				return $http({
					url: this.getLink('self'),
					method: 'PUT',
					data: this.serialize()
				});
			},
			'delete': function () {
				return $http({
					url: this.getLink('self'),
					method: 'DELETE'
				}).then((function (response) {
					this.links = [];
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
				var simplification = {};
				simplification.links = this.links;
				return simplification;
			},
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
