import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
  const res = await ddb.send(
    new ScanCommand({
      TableName: process.env.MOVIES_TABLE!,
    })
  );

  const origin =
    event.headers?.origin || event.headers?.Origin || event.headers?.ORIGIN;
  const allowedOrigins = new Set([
    "https://d13g35ohjws9b1.cloudfront.net",
    "http://localhost:3002",
  ]);

  const items = (res.Items || []).map((item) => unmarshall(item));

  items.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

  return {
    statusCode: 200,
    body: JSON.stringify(items),
    headers: {
      "Access-Control-Allow-Origin": allowedOrigins.has(origin)
        ? origin
        : "https://d13g35ohjws9b1.cloudfront.net",
    },
  };
};
