import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.AWS_S3_BUCKET!;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  fileBuffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
  } catch (error) {
    throw new Error("Error uploading file to S3: " + error);
  }
}
