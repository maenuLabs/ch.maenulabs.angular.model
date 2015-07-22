/**
 * A basic RESTful resource with CRUD methods.
 *
 * @module ch.maenulabs.rest.angular.resource
 * @class IResource
 */
/**
 * Checks whether it has errors or not.
 *
 * @public
 * @method hasErrors
 *
 * @return Boolean true if it has, false otherwise
 */
/**
 * Gets the validation errors.
 *
 * @public
 * @method getErrors
 *
 * @return Object The errors object
 */
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
/**
 * Creates it. After that, it will have an URI.
 *
 * @public
 * @method create
 *
 * @return HttpPromise The request promise
 */
/**
 * Reads it. Only the URI needs to be set and the rest will be populated.
 *
 * @public
 * @method read
 *
 * @return HttpPromise The request promise
 */
/**
 * Updates it.
 *
 * @public
 * @method update
 *
 * @return HttpPromise The request promise
 */
/**
 * Removes it.
 *
 * @public
 * @method remove
 *
 * @return HttpPromise The request promise
 */
/**
 * Searches for similar resources.
 *
 * @public
 * @method search
 *
 * @return HttpPromise The request promise with a results array on it
 */
/**
 * Serializes it to a serialization.
 *
 * @public
 * @method serialize
 *
 * @return String A serialization
 */
/**
 * Deserializes it from a serialization.
 *
 * @public
 * @method 
 *
 * @param String serialization A serialization
 */
/**
 * Simplifies it to a simple object.
 *
 * @public
 * @method simplify
 *
 * @return Object A simple object with the properties:
 *     uri, a String, the URI
 */
/**
 * Desimplifies it from a simple object.
 *
 * @public
 * @method desimplify
 *
 * @param Object simplification A simple object with the properties:
 *     uri, a String, the URI
 */
