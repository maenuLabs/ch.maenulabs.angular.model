/* global ch, angular, i18n:true, describe, it, beforeEach, expect, jasmine, module, inject */
describe('Resource', function () {

	var Resource;
	var $httpBackend;
	var resource;

	beforeEach(module('ch.maenulabs.rest.angular.resource'));

	beforeEach(inject(['$httpBackend', 'ch.maenulabs.rest.angular.resource.Resource', function (_$httpBackend_, _Resource_) {
		Resource = _Resource_;
		$httpBackend = _$httpBackend_;
		resource = new Resource();

	}]));

	describe('static', function () {

		it('should create statically with desimplify', function () {
			resource = Resource.desimplify({
				'@self': ''
			});
			expect(resource instanceof Resource).toBeTruthy();
		});

		it('should create statically with deserialize', function () {
			resource = Resource.deserialize('{'
				+ '"@self": ""'
				+ '}');
			expect(resource instanceof Resource).toBeTruthy();
		});

	});

	describe('constructor', function () {

		it('should have a validation and a empty self', function () {
			resource = new Resource();
			expect(resource.validation).toBeDefined();
			expect(resource['@self']).toBeDefined();
			expect(resource['@self'].length).toEqual(0);
		});

		it('should use the given values', function () {
			var values = {
				a: 1,
				b: 2
			};
			resource = new Resource(values);
			expect(resource.a).toEqual(1);
			expect(resource.b).toEqual(2);
		});

		it('should override initial values with given values', function () {
			var validation = new ch.maenulabs.validation.Validation();
			var values = {
				'@self': '/resource/1',
				validation: validation
			};
			resource = new Resource(values);
			expect(resource['@self']).toBe(values['@self']);
			expect(resource.validation).toBe(validation);
		});

	});

	describe('@self', function () {

		beforeEach(function () {
			resource = Resource.deserialize('{'
				+ '"@self": "/resource/1"'
				+ '}');
		});

		it('should have @self', function () {
			expect(resource['@self']).toEqual('/resource/1');
		});

	});

	describe('simplification', function () {

		it('should implement simplify', function () {
			resource['@self'] = '/resource/1';
			var simplification = resource.simplify();
			expect(simplification['@self']).toEqual(resource['@self']);
		});

		it('should implement desimplify', function () {
			var simplification = {
				'@self': '/resource/1'
			};
			resource.desimplify(simplification);
			expect(resource['@self']).toEqual(simplification['@self']);
		});

	});

	describe('validation', function () {

		var ExistenceCheck;

		beforeEach(function () {
			ExistenceCheck = ch.maenulabs.validation.ExistenceCheck;
		});

		it('should have no errors', function () {
			expect(resource.hasErrors()).toBeFalsy();
			expect(resource.getErrors()).toEqual({});
			expect(resource.hasError('a')).toBeFalsy();
			expect(resource.getError('a')).toEqual([]);
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
				'@self': '/resource/1',
				message: 'hello'
			};
			var CrudResource = new ch.maenulabs.type.Type(Resource, {
				desimplify: function (simplification) {
					this.base('desimplify')(simplification);
					this.message = simplification.message;
				},
				simplify: function () {
					var simplification = this.base('simplify')();
					simplification.message = this.message;
					return simplification;
				}
			});
			resource = CrudResource.desimplify(simplification);
		});

		describe('create', function () {

			var self;

			beforeEach(function () {
				self = '/resource';
				resource['@self'] = self;
			});

			it('should create with success', function () {
				$httpBackend.expect('POST', resource['@self']).respond(201, simplification);
				resource.create().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource['@self']).toEqual(simplification['@self']);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should create with error', function () {
				$httpBackend.expect('POST', resource['@self']).respond(403, '');
				resource.create().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource['@self']).toEqual(self);
				expect(resource.message).toEqual(simplification.message);
			});

		});

		describe('read', function () {

			beforeEach(function () {
				resource.desimplify({
					'@self': simplification['@self']
				});
			});

			it('should read with success', function () {
				$httpBackend.expect('GET', resource['@self']).respond(200, simplification);
				resource.read().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource['@self']).toEqual(simplification['@self']);
				expect(resource.message).toEqual(simplification.message);
			});

			it('should read with error', function () {
				$httpBackend.expect('GET', resource['@self']).respond(404, '');
				resource.read().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource['@self']).toEqual(simplification['@self']);
				expect(resource.message).not.toBeDefined();
			});

		});

		describe('update', function () {

			var message;

			beforeEach(function () {
				message = 'hello hello';
				resource.message = message;
			});

			it('should update with success', function () {
				$httpBackend.expect('PUT', resource['@self']).respond(202, '');
				resource.update().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource['@self']).toEqual(simplification['@self']);
				expect(resource.message).toEqual(message);
			});

			it('should update with error', function () {
				$httpBackend.expect('PUT', resource['@self']).respond(403, '');
				resource.update().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource['@self']).toEqual(simplification['@self']);
				expect(resource.message).toEqual(message);
			});

		});

		describe('delete', function () {

			var message;

			beforeEach(function () {
				message = 'hello hello';
				resource.message = message;
			});

			it('should delete with success', function () {
				$httpBackend.expect('DELETE', resource['@self']).respond(202, '');
				resource.delete().then(success).catch(error);
				$httpBackend.flush();
				expect(success).toHaveBeenCalled();
				expect(error).not.toHaveBeenCalled();
				expect(resource['@self'].length).toEqual(0);
				expect(resource.message).toEqual(message);
			});

			it('should delete with error', function () {
				$httpBackend.expect('DELETE', resource['@self']).respond(404, '');
				resource.delete().then(success).catch(error);
				$httpBackend.flush();
				expect(success).not.toHaveBeenCalled();
				expect(error).toHaveBeenCalled();
				expect(resource['@self']).toEqual(simplification['@self']);
				expect(resource.message).toEqual(message);
			});

		});

	});

});
