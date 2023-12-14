import "dotenv/config";

export default {
  database: process.env.MONGO_DB,
  server: {
    port: process.env.SERVER_PORT,
    origins: process.env.ALLOWED_ORIGINS,
    methods: process.env.ALLOWED_METHODS,
    headers: process.env.ALLOWED_HEADERS,
  },
  token: {
    authorization: process.env.SECRET_AUTH_KEY,
  },
  aws: {
    region: process.env.AWS_BUCKET_REGION,
    bucket: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_PUBLIC_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};
