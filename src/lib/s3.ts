import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/config/env";

const globalForS3 = globalThis as unknown as { s3: S3Client };

function createS3Client() {
  return new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: "us-east-1",
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
  });
}

export const s3 = globalForS3.s3 ?? createS3Client();

if (process.env.NODE_ENV !== "production") {
  globalForS3.s3 = s3;
}
