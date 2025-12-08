import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";

export interface ApiStackProps extends StackProps {
  getMoviesFn: IFunction;
  createMovieFn: IFunction;
  editMovieFn: IFunction;
  deleteMovieFn: IFunction;
}

export class ApiStack extends Stack {
  public readonly api: apigw.RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    this.api = new apigw.RestApi(this, "MoviesApi", {
      restApiName: "Movies Service",
      defaultCorsPreflightOptions: {
        allowOrigins: [
          "https://d13g35ohjws9b1.cloudfront.net",
          "http://localhost:5173",
        ],
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });

    const movies = this.api.root.addResource("movies");

    movies.addMethod("GET", new apigw.LambdaIntegration(props.getMoviesFn));
    movies.addMethod("POST", new apigw.LambdaIntegration(props.createMovieFn));
    movies.addMethod("PUT", new apigw.LambdaIntegration(props.editMovieFn));
    movies.addMethod(
      "DELETE",
      new apigw.LambdaIntegration(props.deleteMovieFn)
    );

    new cdk.CfnOutput(this, "MoviesApiUrl", {
      value: this.api.url,
    });
  }
}
