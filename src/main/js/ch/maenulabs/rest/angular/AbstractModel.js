/* globals angular, ch */
/**
 * A basic RESTful model with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular
 * @class AbstractModel
 */
angular.module('ch.maenulabs.rest.angular').factory('ch.maenulabs.rest.angular.AbstractModel',
		['$http', function ($http) {
	var Validation = ch.maenulabs.validation.Validation;
	return new ch.maenulabs.type.Type(Object, {
		/**
		 * The id.
		 *
		 * @public
		 * @property id
		 * @type Number
		 */
		/**
		 * The validation.
		 *
		 * @public
		 * @property validation
		 * @type Validation
		 */
		/**
		 * Creates a model.
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
		 * Checks whether it can be created.
		 *
		 * @public
		 * @method canBeCreated
		 *
		 * @return Boolean true if it can, false otherwise
		 */
		canBeCreated: function () {
			throw new Error('not implemented');
		},
		/**
		 * Checks whether it can be read.
		 *
		 * @public
		 * @method canBeRead
		 *
		 * @return Boolean true if it can, false otherwise
		 */
		canBeRead: function () {
			throw new Error('not implemented');
		},
		/**
		 * Checks whether it can be updated.
		 *
		 * @public
		 * @method canBeUpdated
		 *
		 * @return Boolean true if it can, false otherwise
		 */
		canBeUpdated: function () {
			throw new Error('not implemented');
		},
		/**
		 * Checks whether it can be removed.
		 *
		 * @public
		 * @method canBeRemoved
		 *
		 * @return Boolean true if it can, false otherwise
		 */
		canBeRemoved: function () {
			throw new Error('not implemented');
		},
		/**
		 * Creates it. After that, it will have an id.
		 *
		 * @public
		 * @method create
		 *
		 * @param Function [success] Called when successful
		 * @param Function [error] Called when unsuccessful
		 *
		 * @return AbstractModel itself
		 */
		create: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.getBasePath(),
				method: 'POST',
				data: this.toJson()
			}).success(angular.bind(this, function (json) {
				this.fromJson(json);
				success.apply(this, arguments);
			})).error(error);
			return this;
		},
		/**
		 * Reads it. Only the id needs to be set and the rest will be populated.
		 *
		 * @public
		 * @method read
		 *
		 * @param Function [success] Called when successful
		 * @param Function [error] Called when unsuccessful
		 *
		 * @return AbstractModel itself
		 */
		read: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.getBasePath() + '/' + this.id,
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
		 * @return AbstractModel itself
		 */
		update: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.getBasePath() + '/' + this.id,
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
		 * @return AbstractModel itself
		 */
		remove: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			$http({
				url: this.getBasePath() + '/' + this.id,
				method: 'DELETE'
			}).success(angular.bind(this, function () {
				this.id = null;
				success.apply(this, arguments);
			})).error(error);
			return this;
		},
		/**
		 * Searches for similar models.
		 *
		 * @public
		 * @method search
		 *
		 * @param Function [success] Called when successful
		 * @param Function [error] Called when unsuccessful
		 *
		 * @return Array The resulting models
		 */
		search: function (success, error) {
			success = success || angular.noop;
			error = error || angular.noop;
			var results = [];
			$http({
				url: this.getSearchPath(),
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
		 *     id, a Number
		 */
		toSerializable: function () {
			return {
				id: this.id
			};
		},
		/**
		 * Deserializes it from a simple serializable object.
		 *
		 * @public
		 * @method fromSerializable
		 *
		 * @param Object serializable A simple object with the properties:
		 *     id, a Number
		 */
		fromSerializable: function (serializable) {
			this.id = serializable.id;
		},
		/**
		 * Gets the base path to make request to, without an ending slash. Must
		 * be overriden in subclass.
		 *
		 * @public
		 * @method getBasePath
		 *
		 * @return String The base path
		 */
		getBasePath: function () {
			throw new Error('not implemented');
		},
		/**
		 * Gets the search path.
		 *
		 * @public
		 * @method getSearchPath
		 *
		 * @return String The search path
		 */
		getSearchPath: function () {
			throw new Error('not implemented');
		}
	}, {
		/**
		 * Creates a model from a JSON.
		 *
		 * @public
		 * @static
		 * @method fromJson
		 *
		 * @param String json A JSON string, see fromSerializable for
		 *     properties
		 *
		 * @return AbstractModel The model that was created from the specified JSON
		 */
		fromJson: function (json) {
			var model = new this();
			model.fromJson(json);
			return model;
		},
		/**
		 * Creates a model from a serializable object.
		 *
		 * @public
		 * @static
		 * @method fromSerializable
		 *
		 * @param Object serializable A serializable object, see
		 *     fromSerializable for properties
		 *
		 * @return AbstractModel The model that was created from the specified
		 *     serializable
		 */
		fromSerializable: function (serializable) {
			var model = new this();
			model.fromSerializable(serializable);
			return model;
		}
	});
}]);
