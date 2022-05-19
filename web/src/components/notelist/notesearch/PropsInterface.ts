/**
 * Represents the note search component's properties.
 */
interface PropsInterface {
    /**
     * Search intent handler.
     */
    onSearchIntent?(phrase: string): void;
}

export default PropsInterface;
