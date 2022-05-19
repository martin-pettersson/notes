import { ApplicationBuilder, Startup } from "@notes/web";
import { ConfigurationBuilder, ObjectConfigurationSource } from "@moonwalkingbits/apollo/configuration";
import { ConsoleHandler } from "@notes/web/log";
import { LoggerBuilder } from "@moonwalkingbits/apollo/log";
import { createRoot } from "react-dom/client";

// NOTE This variable is injected at compile time.
declare const CONFIGURATION: any;

const configuration = await new ConfigurationBuilder()
    .addConfigurationSource(new ObjectConfigurationSource(CONFIGURATION))
    .build();
const logger = new LoggerBuilder()
    .addHandler(new ConsoleHandler())
    .build();
const application = await new ApplicationBuilder()
    .useConfiguration(configuration)
    .useLogger(logger)
    .useStartupClass(Startup)
    .build();

createRoot(document.getElementById("application")!).render(application);
