export const env = {
  // Server
  port: process.env.PORT as string,
  nodeVersion: process.env.NODE_VERSION as string,

  // Database
  databaseUrl: process.env.DATABASE_URL as string,

  // Authentication
  jwtSecret: process.env.JWT_SECRET as string,

  // App
  appName: process.env.APP_NAME as string,
  appDomain: process.env.APP_DOMAIN as string,
  appEmail: process.env.APP_EMAIL as string,

  // AWS
  awsRegion: process.env.AWS_REGION as string,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,

  // Origins
  originsAllowed: process.env.ORIGINS_ALLOWED as string,
};
