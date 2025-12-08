

import * as cdk from "aws-cdk-lib";
import { DynamoDbStack } from "../lib/dynamodb-stack";
import { LambdaStack } from "../lib/lambda-stack";
import { ApiStack } from "../lib/api-stack";

const app = new cdk.App();

const db = new DynamoDbStack(app, "DbStack");

const lambdas = new LambdaStack(app, "LambdaStack", {
  moviesTable: db.moviesTable,
});

new ApiStack(app, "ApiStack", {
  getMoviesFn: lambdas.getMoviesFn,
  createMovieFn: lambdas.createMovieFn,
  editMovieFn: lambdas.editMovieFn,
  deleteMovieFn: lambdas.deleteMovieFn,
});
