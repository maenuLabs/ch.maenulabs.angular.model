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
