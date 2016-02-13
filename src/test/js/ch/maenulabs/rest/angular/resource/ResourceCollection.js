/* global ch, i18n:true, describe, it, beforeEach, expect, module, inject */
describe('ResourceCollection', function () {

	var ResourceCollection;
	var $httpBackend;
	var resource;
	
	beforeEach(module('ch.maenulabs.rest.angular.resource'));

	beforeEach(inject(['$httpBackend', 'ch.maenulabs.rest.angular.resource.ResourceCollection', function (_$httpBackend_, _ResourceCollection_) {
		ResourceCollection = _ResourceCollection_;
		$httpBackend = _$httpBackend_;
		resource = new ResourceCollection();
	}]));

	describe('constructor', function () {

		it('should have empty resources', function () {
			resource = new ResourceCollection();
			expect(resource.resources).toBeDefined();
			expect(resource.resources.length).toEqual(0);
		});

		it('should override initial values with given values', function () {
			var resources = [{
				a: 1
			}];
			var values = {
				resources: resources
			};
			resource = new ResourceCollection(values);
			expect(resource.resources).toBe(resources);
		});

	});

	describe('simplification', function () {
		
		describe('resources', function () {
			
			var Resource;
			var selfLink;
			var resource0SelfLink;
			
			beforeEach(inject(['ch.maenulabs.rest.angular.resource.Resource', function (_Resource_) {
				Resource = _Resource_;
				selfLink = '/resource?a=b';
				resource0SelfLink = '/resource/1';
			}]));
			
			it('should simplify resources', function () {
				var resources = [{
					links: [{
						rel: ['self'],
						href: resource0SelfLink
					}]
				}];
				resource.links = [{
					rel: ['self'],
					href: selfLink
				}];
				resource.resources = [
					new Resource(resources[0])
				];
				var simplification = resource.simplify();
				expect(resource.getLink('self')).toEqual(selfLink);
				expect(simplification.resources).toEqual(resources);
			});

			it('should desimplify resources', function () {
				var simplification = {
					links: [{
						rel: ['self'],
						href: selfLink
					}],
					resources: [{
						links: [{
							rel: ['self'],
							href: resource0SelfLink
						}]
					}]
				};
				resource.resourceType = Resource;
				resource.desimplify(simplification);
				expect(resource.getLink('self')).toEqual(selfLink);
				expect(resource.resources.length).toEqual(1);
				expect(resource.resources[0] instanceof Resource).toBeTruthy();
				expect(resource.resources[0].getLink('self')).toEqual(resource0SelfLink);
			});
			
		});

	});

	describe('validation', function () {
		
		it('should have no errors', function () {
			expect(resource.hasErrors()).toBeFalsy();
			expect(resource.getErrors()).toEqual({});
			expect(resource.hasError('a')).toBeFalsy();
			expect(resource.getError('a')).toEqual([]);
		});
		
		describe('resources', function () {
			
			var Resource;
			var message;
			
			beforeEach(inject(['ch.maenulabs.rest.angular.resource.Resource', function (_Resource_) {
				Resource = _Resource_;
				message = 'message';
				i18n = {
					'ch/maenulabs/validation/ExistenceCheck': {
						message: function () {
							return message;
						}
					}
				};
				resource.resources = [
					new Resource({
						uri: 'resource/123'
					})
				];
			}]));
			
			it('should require the resources', function () {
				resource.resources = undefined;
				expect(resource.hasErrors()).toBeTruthy();
				expect(resource.getErrors()).toEqual({
					resources: [message]
				});
				expect(resource.hasError('resources')).toBeTruthy();
				expect(resource.getError('resources')).toEqual([message]);
			});
			
			it('should require all resources to have no errors', function () {
				var ExistenceCheck = ch.maenulabs.validation.ExistenceCheck;
				resource.resources[0].validation.add(new ExistenceCheck('a'));
				expect(resource.hasErrors()).toBeTruthy();
				expect(resource.getErrors()).toEqual({
					resources: [[{
						a: [message]
					}]]
				});
				expect(resource.hasError('resources.0.a')).toBeTruthy();
				expect(resource.getError('resources.0.a')).toEqual([message]);
			});
			
		});

	});

});
