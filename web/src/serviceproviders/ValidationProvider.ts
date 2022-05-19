import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { ServiceProviderInterface } from "@notes/web/serviceproviders";
import { ValidationError, ValidatorFactory } from "@moonwalkingbits/apollo/validation";
import { validate } from "uuid";

/**
 * Provides a generic validation system to the application.
 */
class ValidationProvider implements ServiceProviderInterface {
    /** @inheritDoc */
    public async register(_: ContainerInterface): Promise<void> {}

    /** @inheritDoc */
    public async load(container: ContainerInterface): Promise<void> {
        const validator = new ValidatorFactory().createValidator();

        validator.addValidationFunction("uuid", uuid => {
            if (!validate(uuid)) {
                throw new ValidationError("Must be a valid UUID");
            }
        });

        container.bindInstance("validator", validator);
    }
}

export default ValidationProvider;
