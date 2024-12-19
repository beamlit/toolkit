from beamlit.api.models import get_model_deployment
from beamlit.authentication import get_authentication_headers, new_client
from beamlit.common.settings import init
from beamlit.models.model_deployment import ModelDeployment
from beamlit.run import RunClient

settings = init()
client = new_client()
model_deployment: ModelDeployment = get_model_deployment.sync(
    "gpt-4o-mini", "production", client=client
)
# init_agent(client=client)
run_client = RunClient(client=client)
response = run_client.run(
    "function", "math", settings.environment, method="POST", json={"query": "4+4"}
)

if response.status_code == 200:
    print(response.json())
else:
    print(response.text)
print(get_authentication_headers(settings))
