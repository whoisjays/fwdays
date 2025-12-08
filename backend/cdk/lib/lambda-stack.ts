import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export interface LambdaStackProps extends StackProps {
  moviesTable: Table;
}

export class LambdaStack extends Stack {
  public readonly getMoviesFn: NodejsFunction;
  public readonly createMovieFn: NodejsFunction;
  public readonly editMovieFn: NodejsFunction;
  public readonly deleteMovieFn: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.getMoviesFn = new NodejsFunction(this, "GetMoviesFn", {
      entry: path.join(__dirname, "../../lambdas/getMovies.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(10),
      environment: {
        MOVIES_TABLE: props.moviesTable.tableName,
      },
    });

    this.createMovieFn = new NodejsFunction(this, "CreateMovieFn", {
      entry: path.join(__dirname, "../../lambdas/createMovie.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(10),
      environment: {
        MOVIES_TABLE: props.moviesTable.tableName,
      },
    });

    this.editMovieFn = new NodejsFunction(this, "EditMovieFn", {
      entry: path.join(__dirname, "../../lambdas/editMovie.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(10),
      environment: {
        MOVIES_TABLE: props.moviesTable.tableName,
      },
    });

    this.deleteMovieFn = new NodejsFunction(this, "DeleteMovieFn", {
      entry: path.join(__dirname, "../../lambdas/deleteMovie.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(10),
      environment: {
        MOVIES_TABLE: props.moviesTable.tableName,
      },
    });

    props.moviesTable.grantReadData(this.getMoviesFn);
    props.moviesTable.grantReadWriteData(this.createMovieFn);
    props.moviesTable.grantReadWriteData(this.editMovieFn);
    props.moviesTable.grantReadWriteData(this.deleteMovieFn);
  }
}
