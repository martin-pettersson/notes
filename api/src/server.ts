import { ConfigurationBuilder, JsonConfigurationSource } from "@moonwalkingbits/apollo/configuration";
import { LoggerBuilder, StreamHandler } from "@moonwalkingbits/apollo/log";
import { ServerBuilder } from "@moonwalkingbits/apollo/server";
import { Startup } from "@notes/api";

const configuration = await new ConfigurationBuilder()
    .addConfigurationSource(new JsonConfigurationSource("configuration.json"))
    .build();
const logger = new LoggerBuilder()
    .addHandler(new StreamHandler(process.stdout))
    .build();
const server = await new ServerBuilder()
    .useStartupClass(Startup)
    .useConfiguration(configuration)
    .useLogger(logger)
    .build();

server.start(parseInt(process.env.PORT as string) || 3000);
