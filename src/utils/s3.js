import crypto from "crypto";
import aws from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/index.js";

const client = new aws.S3Client({
  region: env.aws.region,
  credentials: {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  },
});

export async function uploadS3File(file) {
  const ext = file.originalname.split(".").pop();
  const filename = `${
    file.fieldname
  }-${Date.now()}_${crypto.randomUUID()}.${ext}`;

  const command = new aws.PutObjectCommand({
    Bucket: env.aws.bucket,
    Key: filename,
    Body: file.buffer,
  });

  const S3File = await client.send(command);
  return { S3File, filename };
}

async function removeFileS3(filename, credentials) {
  const client = new S3Client({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  });

  const command = new DeleteObjectCommand({
    Bucket: credentials.bucket,
    Key: filename,
  });

  const data = await client.send(command);
  return data;
}

async function getFileS3(filename, credentials) {
  const client = new S3Client({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  });

  const command = new GetObjectCommand({
    Bucket: credentials.bucket,
    Key: filename,
  });

  const data = await client.send(command);
  return data;
}

export async function getS3FileURL(filename) {
  const command = new aws.GetObjectCommand({
    Bucket: env.aws.bucket,
    Key: filename,
  });

  return await getSignedUrl(client, command);
}
