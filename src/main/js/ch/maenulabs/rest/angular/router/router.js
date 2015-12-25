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
