/* global ch, angular, i18n:true, describe, it, beforeEach, expect, jasmine, module, inject */
describe('ResourcePage', function () {

	var ResourcePage;
	var $httpBackend;
	var resource;
	
	beforeEach(module('ch.maenulabs.rest.angular'));

	beforeEach(inject(['$httpBackend', 'ch.maenulabs.rest.angular.ResourcePage', function (_$httpBackend_, _ResourcePage_) {
		ResourcePage = _ResourcePage_;
		$httpBackend = _$httpBackend_;
		resource = new ResourcePage();
	}]));

	describe('static', function () {

		it('should create statically with desimplify', function () {
			resource = ResourcePage.desimplify({
				uri: '/resource/1',
				resources: []
			});
			expect(resource instanceof ResourcePage).toBeTruthy();
			expect(resource.uri).toEqual('/resource/1');
			expect(resource.resources).toEqual([]);
		});

		it('should create statically with deserialize', function () {
			resource = ResourcePage.deserialize('{"uri":"/resource/1","resources":[]}');
			expect(resource instanceof ResourcePage).toBeTruthy();
			expect(resource.uri).toEqual('/resource/1');
			expect(resource.resources).toEqual([]);
		});

	});

	it('should have a validation and a nulled uri', function () {
		expect(resource.uri).not.toBeDefined();
		expect(resource.validation).toBeDefined();
	});

	describe('simplification', function () {

		it('should implement simplify', function () {
			var uri = '/resource/1';
			var resources = [];
			resource.uri = uri;
			resource.resources = resources;
			var simplification = resource.simplify();
			expect(simplification.uri).toEqual(uri);
			expect(simplification.resources).toEqual(resources);
		});

		it('should implement desimplify', function () {
			var simplification = {
				uri: '/resource/1',
				resources: []
			};
			resource.desimplify(simplification);
			expect(resource.uri).toEqual(simplification.uri);
			expect(resource.resources).toEqual(simplification.resources);
		});
		
		describe('resources', function () {
			
			var Resource;
			
			beforeEach(inject(['ch.maenulabs.rest.angular.Resource', function (_Resource_) {
				Resource = _Resource_;
			}]));
			
			it('should simplify resources', function () {
				var uri = '/resource/1';
				var resources = [{
					uri: 'resource/123'
				}];
				resource.uri = uri;
				resource.resources = [
					new Resource(resources[0])
				];
				var simplification = resource.simplify();
				expect(simplification.uri).toEqual(uri);
				expect(simplification.resources).toEqual(resources);
			});

			it('should desimplify resources', function () {
				var simplification = {
					uri: '/resource/1',
					resources: [{
						uri: 'resource/123'
					}]
				};
				resource.resourceType = Resource;
				resource.desimplify(simplification);
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.resources.length).toEqual(1);
				expect(resource.resources[0] instanceof Resource).toBeTruthy();
				expect(resource.resources[0].uri).toEqual(simplification.resources[0].uri);
			});
			
		});

	});

	describe('constructor', function () {

		it('should use the intial values', function () {
			var values = {
				a: 1,
				b: 2
			};
			resource = new ResourcePage(values);
			expect(resource.a).toEqual(1);
			expect(resource.b).toEqual(2);
		});

		it('should override the intial values', function () {
			var validation = new ch.maenulabs.validation.Validation();
			var values = {
				uri: '/resource/1',
				validation: validation
			};
			resource = new ResourcePage(values);
			expect(resource.uri).toEqual('/resource/1');
			expect(resource.validation).toBe(validation);
		});

	});

	describe('validation', function () {

		var ExistenceCheck;
		
		beforeEach(function () {
			ExistenceCheck = ch.maenulabs.validation.ExistenceCheck;
			resource.uri = '/resource/1';
			resource.resources = [];
		});
		
		it('should have no errors', function () {
			expect(resource.hasErrors()).toBeFalsy();
			expect(resource.getErrors()).toEqual({});
			expect(resource.hasError('a')).toBeFalsy();
			expect(resource.getError('a')).toEqual([]);
		});

		it('should require the URI', function () {
			resource.uri = undefined;
			var message = 'message';
			i18n = {
				'ch/maenulabs/validation/ExistenceCheck': {
					message: function () {
						return message;
					}
				}
			};
			expect(resource.hasErrors()).toBeTruthy();
			expect(resource.getErrors()).toEqual({
				uri: [message]
			});
			expect(resource.hasError('uri')).toBeTruthy();
			expect(resource.getError('uri')).toEqual([message]);
		});

		it('should require the resources', function () {
			resource.resources = undefined;
			var message = 'message';
			i18n = {
				'ch/maenulabs/validation/ExistenceCheck': {
					message: function () {
						return message;
					}
				}
			};
			expect(resource.hasErrors()).toBeTruthy();
			expect(resource.getErrors()).toEqual({
				resources: [message]
			});
			expect(resource.hasError('resources')).toBeTruthy();
			expect(resource.getError('resources')).toEqual([message]);
		});

		it('should allow to add checks', function () {
			var message = 'message';
			i18n = {
				'ch/maenulabs/validation/ExistenceCheck': {
					message: function () {
						return message;
					}
				}
			};
			resource.a = null;
			resource.b = 1;
			resource.validation.add(new ExistenceCheck('a'));
			expect(resource.hasErrors()).toBeTruthy();
			expect(resource.getErrors()).toEqual({
				a: [message]
			});
			expect(resource.hasError('a')).toBeTruthy();
			expect(resource.getError('a')).toEqual([message]);
			expect(resource.hasError('b')).toBeFalsy();
			expect(resource.getError('b')).toEqual([]);
		});
		
		describe('resources', function () {
			
			var Resource;
			
			beforeEach(inject(['ch.maenulabs.rest.angular.Resource', function (_Resource_) {
				Resource = _Resource_;
				resource.resources = [
					new Resource({
						uri: 'resource/123'
					})
				];
			}]));
			
			it('should have no errors', function () {
				expect(resource.hasErrors()).toBeFalsy();
				expect(resource.getErrors()).toEqual({});
				expect(resource.hasError('a')).toBeFalsy();
				expect(resource.getError('a')).toEqual([]);
			});
			
			it('should require all resources to have no errors', function () {
				var message = 'message';
				i18n = {
					'ch/maenulabs/validation/ExistenceCheck': {
						message: function () {
							return message;
						}
					}
				};
				resource.resources[0].uri = undefined
				expect(resource.hasErrors()).toBeTruthy();
				expect(resource.getErrors()).toEqual({
					resources: [[{
						uri: [message]
					}]]
				});
				expect(resource.hasError('resources.0.uri')).toBeTruthy();
				expect(resource.getError('resources.0.uri')).toEqual([message]);
			});
			
		});

	});

	describe('serialization', function () {

		var simplification;

		beforeEach(function () {
			simplification = {
				a: 1
			};
		});

		it('should serialize the simplification from serialize', function () {
			resource.simplify = jasmine.createSpy().and.returnValue(simplification);
			var serialization = resource.serialize();
			expect(resource.simplify).toHaveBeenCalled();
			expect(serialization).toEqual(angular.toJson(simplification));
		});

		it('should deserialize the simplification from deserialize', function () {
			resource.desimplify = jasmine.createSpy();
			resource.deserialize(angular.toJson(simplification));
			expect(resource.desimplify).toHaveBeenCalledWith(simplification);
		});

	});

	describe('crud', function () {
		
		var success;
		var error;
		var simplification;

		beforeEach(function () {
			success = jasmine.createSpy();
			error = jasmine.createSpy();
			simplification = {
				uri: '/resource/1',
				message: 'hello'
			};
			resource.desimplify = function (simplification) {
				this.uri = simplification.uri;
				this.message = simplification.message;
			};
			resource.simplify = function () {
				return {
					uri: this.uri,
					message: this.message
				};
			};
		});

		describe('create', function () {

			beforeEach(function () {
				resource.uri = '/resource';
				resource.message = simplification.message;
			});

			it('should create with success', function () {
				$httpBackend.expect('POST', resource.uri).respond(201, '', {
					'location': '/resource/1'
				});
				resource.create().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should create with error', function () {
				$httpBackend.expect('POST', resource.uri).respond(403, '');
				resource.create().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual('/resource');
				expect(resource.message).toEqual(simplification.message);
			});

		});

		describe('read', function () {

			beforeEach(function () {
				resource.uri = simplification.uri;
			});

			it('should read with success', function () {
				$httpBackend.expect('GET', resource.uri).respond(200, {
					uri: simplification.uri,
					message: simplification.message
				});
				resource.read().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should read with error', function () {
				$httpBackend.expect('GET', resource.uri).respond(404, '');
				resource.read().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).not.toBeDefined();
			});

		});

		describe('update', function () {

			var message;

			beforeEach(function () {
				message = 'hello hello';
				resource.uri = simplification.uri;
				resource.message = message;
			});

			it('should update with success', function () {
				$httpBackend.expect('PUT', resource.uri).respond(202, '');
				resource.update().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(message);
			});

			it('should update with error', function () {
				$httpBackend.expect('PUT', simplification.uri).respond(403, '');
				resource.update().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).toEqual(message);
			});

		});

		describe('delete', function () {

			beforeEach(function () {
				resource.uri = simplification.uri;
			});

			it('should delete with success', function () {
				$httpBackend.expect('DELETE', resource.uri).respond(202, '');
				resource.delete().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource.uri).toBeNull();
			});

			it('should delete with error', function () {
				$httpBackend.expect('DELETE', resource.uri).respond(404, '');
				resource.delete().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource.uri).toEqual(simplification.uri);
				expect(resource.message).not.toBeDefined();
			});

		});

	});

});
