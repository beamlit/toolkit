import { tool } from "@langchain/core/tools";

const helloWorld = () => {
  return "Hello from Beamlit";
};

export const helloworld = tool(helloWorld, {
  name: "hello_world",
  description: "Say hello to the world from beamlit",
});
