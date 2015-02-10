/**
 * A basic RESTful model with CRUD methods.
 *
 * @module ch.maenulabs.angular.model
 * @class IModel
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
 * @param Function [success] Called when successful
 * @param Function [error] Called when unsuccessful
 *
 * @return IModel itself
 */
/**
 * Reads it. Only the URI needs to be set and the rest will be populated.
 *
 * @public
 * @method read
 *
 * @param Function [success] Called when successful
 * @param Function [error] Called when unsuccessful
 *
 * @return IModel itself
 */
/**
 * Updates it.
 *
 * @public
 * @method update
 *
 * @param Function [success] Called when successful
 * @param Function [error] Called when unsuccessful
 *
 * @return IModel itself
 */
/**
 * Removes it.
 *
 * @public
 * @method remove
 *
 * @param Function [success] Called when successful
 * @param Function [error] Called when unsuccessful
 *
 * @return IModel itself
 */
/**
 * Searches for similar models.
 *
 * @public
 * @method search
 *
 * @param Function [success] Called when successful
 * @param Function [error] Called when unsuccessful
 *
 * @return Array The resulting models
 */
/**
 * Serializes it to a JSON string.
 *
 * @public
 * @method toJson
 *
 * @return String A JSON string
 */
/**
 * Deserializes it from a JSON string.
 *
 * @public
 * @method fromJson
 *
 * @param String json A JSON string
 */
/**
 * Serializes it to a simple serializable object.
 *
 * @public
 * @method toSerializable
 *
 * @return Object A simple object with the properties:
 *     uri, a String
 */
/**
 * Deserializes it from a simple serializable object.
 *
 * @public
 * @method fromSerializable
 *
 * @param Object serializable A simple object with the properties:
 *     uri, a String
 */
