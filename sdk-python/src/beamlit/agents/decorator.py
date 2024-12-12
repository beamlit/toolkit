# Import necessary modules
import ast
import importlib
import os
from logging import getLogger

from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

from beamlit.api.models import get_model_deployment
from beamlit.authentication import new_client
from beamlit.common.settings import get_settings, init
from beamlit.errors import UnexpectedStatus
from beamlit.models import AgentDeployment

from .chat import get_chat_model


def get_functions(dir="src/functions", from_decorator="function"):
    functions = []
    logger = getLogger(__name__)

    # Walk through all Python files in functions directory and subdirectories
    for root, _, files in os.walk(dir):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                # Read and compile the file content
                with open(file_path) as f:
                    try:
                        file_content = f.read()
                        # Parse the file content to find decorated functions
                        tree = ast.parse(file_content)

                        # Look for function definitions with decorators
                        for node in ast.walk(tree):
                            if (
                                not isinstance(node, ast.FunctionDef)
                                or len(node.decorator_list) == 0
                            ):
                                continue
                            decorator = node.decorator_list[0]

                            decorator_name = ""
                            if isinstance(decorator, ast.Call):
                                decorator_name = decorator.func.id
                            if isinstance(decorator, ast.Name):
                                decorator_name = decorator.id

                            if decorator_name == from_decorator:
                                # Get the function name and decorator name
                                func_name = node.name

                                # Import the module to get the actual function
                                spec = importlib.util.spec_from_file_location(func_name, file_path)
                                module = importlib.util.module_from_spec(spec)
                                spec.loader.exec_module(module)
                                # Check if kit=True in the decorator arguments
                                is_kit = False
                                if isinstance(decorator, ast.Call):
                                    for keyword in decorator.keywords:
                                        if keyword.arg == "kit" and isinstance(
                                            keyword.value, ast.Constant
                                        ):
                                            is_kit = keyword.value.value
                                if is_kit:
                                    kit_functions = get_functions(
                                        dir=os.path.join(root),
                                        from_decorator="kit",
                                    )
                                    functions.extend(kit_functions)

                                # Get the decorated function
                                if not is_kit and hasattr(module, func_name):
                                    func = getattr(module, func_name)
                                    functions.append(func)
                    except Exception as e:
                        logger.warning(f"Error processing {file_path}: {e!s}")
    return functions


def agent(
    bl_agent: AgentDeployment = None,
    chat_model=None,
    agent=None,
):
    settings = init()
    logger = getLogger(__name__)

    def wrapper(func):
        settings = get_settings()

        def wrapped(*args, **kwargs):
            return func(
                settings.agent.agent,
                settings.agent.chat_model,
                settings.agent.functions,
                *args,
                **kwargs,
            )

        return wrapped

    # Initialize functions array to store decorated functions
    functions = get_functions(dir=settings.agent.functions_directory)
    settings.agent.functions = functions

    if bl_agent.model and chat_model is None:
        client = new_client()
        try:
            response = get_model_deployment.sync_detailed(
                bl_agent.model, settings.environment, client=client
            )
            settings.agent.model = response.parsed
        except UnexpectedStatus as e:
            if e.status_code == 404 and settings.environment != "production":
                try:
                    response = get_model_deployment.sync_detailed(
                        bl_agent.model, "production", client=client
                    )
                    settings.agent.model = response.parsed
                except UnexpectedStatus as e:
                    if e.status_code == 404:
                        raise ValueError(f"Model {bl_agent.model} not found")
            else:
                raise e
        chat_model = get_chat_model(settings.agent.model)
        settings.agent.chat_model = chat_model
        runtime = settings.agent.model.runtime
        logger.info(f"Chat model configured, using: {runtime.type_}:{runtime.model}")

    if len(functions) == 0:
        raise ValueError(
            "You must define at least one function, you can define this function in directory "
            f'"{settings.agent.functions_directory}". Here is a sample function you can use:\n\n'
            "from beamlit.functions import function\n\n"
            "@function()\n"
            "def hello_world(query: str):\n"
            "    return 'Hello, world!'\n"
        )

    if agent is None and chat_model is not None:
        memory = MemorySaver()
        agent = create_react_agent(chat_model, functions, checkpointer=memory)
        settings.agent.agent = agent

    return wrapper