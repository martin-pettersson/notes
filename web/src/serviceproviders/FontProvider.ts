import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { LoggerInterface } from "@moonwalkingbits/apollo/log";
import { ServiceProviderInterface } from "@notes/web/serviceproviders";

/**
 * Provides application fonts.
 */
class FontProvider implements ServiceProviderInterface {
    /**
     * Application configuration.
     */
    private readonly configuration;

    /**
     * Application logger.
     */
    private readonly logger;

    /**
     * Create a new font provider instance.
     *
     * @param configuration Application configuration.
     * @param logger Application logger.
     */
    public constructor(configuration: ConfigurationInterface, logger: LoggerInterface) {
        this.configuration = configuration;
        this.logger = logger;
    }

    /** @inheritDoc */
    public async register(_: ContainerInterface): Promise<void> {}

    /** @inheritDoc */
    public async load(): Promise<void> {
        const fonts = Object.values(this.configuration.get("typography.fonts", {}))
            .map(this.createFontFace.bind(this));

        try {
            await Promise.all(
                fonts.map(
                    font => font.load()
                        .then(font => document.fonts.add(font))
                )
            );
        } catch (error) {
            this.logger.error("Could not load fonts: {message}", {message: error.message});
        }
    }

    /**
     * Create a font face instance from the given font definition.
     *
     * @param definition Arbitrary font definition.
     * @return Font face instance.
     */
    private createFontFace(definition: any): FontFace {
        return new FontFace(
            definition.family[0],
            this.createFontSource(definition.sources),
            {
                style: definition.style,
                weight: definition.weight,
                unicodeRange: definition.unicodeRange,
            }
        );
    }

    /**
     * Produce a font source string from the given source set.
     *
     * @param sources Arbitrary set of font sources.
     * @return String representing a font source.
     */
    private createFontSource(sources: any): string {
        return Object.entries(sources)
            .map(
                ([ format, location ]) => format === "local" ?
                    `local("${location}")` :
                    `url(${location}) format("${format}")`
            )
            .join(",");
    }
}

export default FontProvider;
