import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuid } from "uuid";

const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
  const body = JSON.parse(event.body);

  const item = {
    id: uuid(),
    title: body.title,
    year: body.year,
    createdAt: Date.now().toString(),
  };

  await ddb.send(
    new PutItemCommand({
      TableName: process.env.MOVIES_TABLE!,
      Item: marshall(item),
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(item),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
