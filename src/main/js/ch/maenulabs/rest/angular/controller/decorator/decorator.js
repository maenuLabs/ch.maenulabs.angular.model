/* globals angular */
/**
 * Decorator for $controller that instantiates generic controllers.
 * Set controller like 'Create'.
 * Requires resource on the scope and injects it into the controller.
 *
 * @module ch.maenulabs.rest.angular.controller.decorator
 * @class decorator
 */
angular.module('ch.maenulabs.rest.angular.controller.decorator').decorator('$controller', ['$injector', '$parse', '$delegate', function ($injector, $parse, $delegate) {
	var CONTROLLER_REGEX = /^([^\(\s]+)(\(([^\)]*)\))?(\s+as\s+(\w+))?$/;
	return function (expression, locals, later, identifier) {
		try {
			return $delegate.apply(this, arguments);
		} catch (error) {
			var match = expression.match(CONTROLLER_REGEX);
			// get controller
			var controllerParts = match[1].split('.');
			var actionName = controllerParts[controllerParts.length - 1];
			var controller = $injector.get('ch.maenulabs.rest.angular.controller.' + actionName);
			// get locals.resource
			if (match[3]) {
				locals.resource = $parse(match[3])(locals.$scope);
			}
			// get identifier
			if (match[5] && !identifier) {
				identifier = match[5];
			}
			return $delegate.apply(this, [controller, locals, later, identifier]);
		}
	};
}]);
