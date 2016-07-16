/* globals angular, ch */
/**
 * A basic RESTful resource collection with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular.resource
 * @class ResourceCollection
 * @extends ch.maenulabs.rest.angular.resource.Resource
 */
angular.module('ch.maenulabs.rest.angular.resource').factory('ch.maenulabs.rest.angular.resource.ResourceCollection', [
	'ch.maenulabs.rest.angular.resource.Resource',
	function (Resource) {
		var ExistenceCheck = ch.maenulabs.validation.ExistenceCheck;
		var PropertiesCheck = ch.maenulabs.validation.PropertiesCheck;
		return new ch.maenulabs.type.Type(Resource, {
			/**
			 * The resource type.
			 *
			 * @public
			 * @property resourceType
			 * @type ch.maenulabs.type.Type<ch.maenulabs.rest.angular.resource.Resource>
			 */
			/**
			 * The resources.
			 *
			 * @public
			 * @property resources
			 * @type Array<ch.maenulabs.rest.angular.resource.Resource>
			 */
			/**
			 * Creates a resource collection.
			 *
			 * @constructor
			 *
			 * @param {Object} [values={}] A map of initial values 
			 */
			initialize: function (values) {
				this.base('initialize')(values);
				this.resources = this.resources || [];
				this.validation.add(new ExistenceCheck('resources'));
				this.validation.add(new PropertiesCheck([
					'resources'
				], function (resources) {
					if (!resources) {
						return true;
					}
					return !resources.some(function (resource) {
						return resource.hasErrors();
					});
				}, function (resources) {
					return resources.map(function (resource) {
						return resource.getErrors();
					});
				}));
			},
			/**
			 * Simplifies it to a simple object.
			 *
			 * @public
			 * @method simplify
			 *
			 * @return Object A simple object with the properties:
			 *     @self, an URI to itself:
			 *     resources, an Array of simplifications of the resources
			 */
			simplify: function () {
				var simplification = this.base('simplify')();
				simplification.resources = this.resources.map(function (resource) {
					return resource.simplify();
				});
				return simplification;
			},
			/**
			 * Desimplifies it from a simple object.
			 *
			 * @public
			 * @method desimplify
			 *
			 * @param {Object} simplification A simple object with the properties:
			 *     @self, an URI to itself:
			 *     resources, an Array of simplifications of the resources
			 */
			desimplify: function (simplification) {
				this.base('desimplify')(simplification);
				this.resources = simplification.resources.map((function (resourceSimplification) {
					return this.resourceType.desimplify(resourceSimplification);
				}).bind(this));
			}
		});
	}
]);
