import {
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
  const id = event.queryStringParameters?.id as string | undefined;
  const createdAt =
    event.queryStringParameters?.createdAt as string | undefined;

  const origin =
    event.headers?.origin || event.headers?.Origin || event.headers?.ORIGIN;
  const allowedOrigins = new Set([
    "https://d13g35ohjws9b1.cloudfront.net",
    "http://localhost:3002",
  ]);

  if (!id || !createdAt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing movie id or createdAt" }),
    };
  }

  const body = JSON.parse(event.body ?? "{}");

  if (!body.title || typeof body.year !== "number") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid payload" }),
    };
  }

  const res = await ddb.send(
    new UpdateItemCommand({
      TableName: process.env.MOVIES_TABLE!,
      Key: {
        id: { S: id },
        createdAt: { S: createdAt },
      },
      UpdateExpression: "SET #title = :title, #year = :year",
      ExpressionAttributeNames: {
        "#title": "title",
        "#year": "year",
      },
      ExpressionAttributeValues: {
        ":title": { S: body.title },
        ":year": { N: String(body.year) },
      },
      ReturnValues: "ALL_NEW",
    })
  );

  const updated = res.Attributes ? unmarshall(res.Attributes) : null;

  return {
    statusCode: 200,
    body: JSON.stringify(updated),
    headers: {
      "Access-Control-Allow-Origin": allowedOrigins.has(origin)
        ? origin
        : "https://d13g35ohjws9b1.cloudfront.net",
    },
  };
};
