import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

console.log('running');

async function getDBSecrets() {
  const psqlSecretName = "w3d3/psql";

  const client = new SecretsManagerClient({
    region: "us-east-1",
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: psqlSecretName,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
     throw error;
  }

  const secret = response.SecretString;
  return secret;
}

getDBSecrets().then(console.log);