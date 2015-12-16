/* globals angular */
/**
 * Decorator for $controller that instantiates generic controllers.
 * Set controller like 'Create'.
 * Requires $resolve.resource on the scope and sets it on the controller.
 *
 * @module ch.maenulabs.rest.angular.controller.decorator
 * @class decorator
 */
angular.module('ch.maenulabs.rest.angular.controller.decorator').decorator('$controller', ['$injector', '$delegate', function ($injector, $delegate) {
	return function () {
		try {
			return $delegate.apply(this, arguments);
		} catch (error) {
			var controller = arguments[0];
			var locals = arguments[1];
			var parts = controller.split(' ');
			var controllerParts = parts[0].split('.');
			var actionName = controllerParts[controllerParts.length - 1];
			controller = $injector.get('ch.maenulabs.rest.angular.controller.' + actionName + 'Factory');
			locals.resource = locals.$scope.$resolve.resource;
			arguments = Array.prototype.slice.apply(arguments);
			arguments[0] = controller;
			arguments[1] = locals;
			// set controller as
			if (parts.length == 3 && !arguments[3]) {
				arguments[3] = parts[2];
			}
			return $delegate.apply(this, arguments);
		}
	};
}]);
