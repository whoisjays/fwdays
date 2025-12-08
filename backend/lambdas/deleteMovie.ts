import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
  const id = event.queryStringParameters?.id as string | undefined;
  const createdAt =
    event.queryStringParameters?.createdAt as string | undefined;

  if (!id || !createdAt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing movie id or createdAt" }),
    };
  }

  await ddb.send(
    new DeleteItemCommand({
      TableName: process.env.MOVIES_TABLE!,
      Key: {
        id: { S: id },
        createdAt: { S: createdAt },
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
