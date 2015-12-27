/* globals angular */
/**
 * Decorator for $controller that instantiates generic controllers.
 * Set controller like 'Create'.
 * Requires resource on the scope and injects it into the controller.
 *
 * @module ch.maenulabs.rest.angular.controller.decorator
 * @class decorator
 */
angular.module('ch.maenulabs.rest.angular.controller.decorator').decorator('$controller', ['$parse', '$delegate', function ($parse, $delegate) {
	var CONTROLLER_REGEX = /^([^\(\s]+)(\(([^\)]*)\))?(\s+as\s+(\w+))?$/;
	var $controllerMinErr = angular.$$minErr('ch.maenulabs.rest.angular.controller.decorator.$controller');
	return function (expression, locals, later, identifier) {
		var match = expression.match(CONTROLLER_REGEX);
		if (!match) {
			throw $controllerMinErr('ctrlfmt', "Badly formed controller string '{0}'. Must match `__name__ as __id__` or `__name__` or `__name__(__expression__) as __id__` or `__name__(__expression__)`.", expression);
		}
		// get name
		var name = match[1];
		// get locals.resource
		if (match[3]) {
			locals.resource = $parse(match[3])(locals.$scope);
		}
		// get identifier
		if (match[5] && !identifier) {
			identifier = match[5];
		}
		return $delegate.apply(this, [name, locals, later, identifier]);
	};
}]);
