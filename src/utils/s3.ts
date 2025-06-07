import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET_NAME } from "./s3Config";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const uploadToS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  const fileExt = path.extname(file.originalname);
  const fileKey = `${uuidv4()}${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
};
