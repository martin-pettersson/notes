import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { Constructor, fetchConstructor } from "@notes/api";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { DECORATOR_METADATA_KEY, RouterBuilder } from "@moonwalkingbits/apollo/routing";
import { RequestInterface, RequestMethod, ResponseInterface } from "@moonwalkingbits/apollo/http";
import { ServiceProviderInterface } from "@notes/api/serviceproviders";

type ControllerRoute = {
    method: RequestMethod,
    pattern: string,
    action: string
};

type RouteAction = (
    request: RequestInterface,
    parameters: {[key: string]: string}
) => Promise<ResponseInterface>;

/**
 * Provides HTTP routing capabilities to the application.
 */
class RoutingProvider implements ServiceProviderInterface {
    /**
     * Application container.
     */
    private readonly container: ContainerInterface;

    /**
     * Application configuration.
     */
    private readonly configuration: ConfigurationInterface;

    /**
     * Create a new middleware service provider instance.
     *
     * @param container Application container.
     * @param configuration Application configuration.
     */
    public constructor(container: ContainerInterface, configuration: ConfigurationInterface) {
        this.container = container;
        this.configuration = configuration;
    }

    /** @inheritDoc */
    public async register(_: ContainerInterface): Promise<void> {}

    /** @inheritDoc */
    public async load(routerBuilder: RouterBuilder): Promise<void> {
        const controllerRoutes = this.collectRoutesFrom(await Promise.all(
            this.configuration.get("controllers", []).map(fetchConstructor)
        ));

        for (const { controller, route, actionRoute: { method, pattern, action } } of controllerRoutes) {
            routerBuilder.addRoute(method, `${route}/${pattern}`, this.wrapControllerAction(controller, action));
        }

        this.container.bindInstance("router", routerBuilder.build());
    }

    /**
     * Collect action routes from the given set of controllers.
     *
     * @param controllers Arbitrary set of controller constructors.
     * @return Compiled set of action routes.
     */
    private collectRoutesFrom(
        controllers: Array<Constructor>
    ): Array<{controller: Constructor, route: string, actionRoute: ControllerRoute}> {
        return controllers.flatMap(controller => {
            const { route = "", routes = [] } = controller[DECORATOR_METADATA_KEY as keyof typeof controller] ?? {};

            return routes.map(actionRoute => ({controller, route, actionRoute}));
        });
    }

    /**
     * Wrap the given controller action to allow controller constructor and actions to use the application container.
     *
     * @param constructor Controller constructor.
     * @param action Controller action.
     * @return Route action.
     */
    private wrapControllerAction(constructor: Constructor, action: string): RouteAction {
        return (request, parameters) => {
            const controller = this.container.construct(constructor);

            return this.container.invoke(
                controller[action].bind(controller),
                {request, ...parameters},
                controller[action]
            );
        };
    }
}

export default RoutingProvider;
