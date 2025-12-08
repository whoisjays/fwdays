import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});

export const handler = async () => {
  const res = await ddb.send(
    new ScanCommand({
      TableName: process.env.MOVIES_TABLE!,
    })
  );

  const items = (res.Items || []).map((item) => unmarshall(item));

  items.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

  return {
    statusCode: 200,
    body: JSON.stringify(items),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
