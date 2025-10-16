import * as Utils from "src/utils";
import * as Interfaces from "src/interfaces";
import { prisma } from "src/utils";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToR2 = async (file: Express.Multer.File): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await r2Client.send(command);
    return `https://${process.env.R2_BUCKET_NAME}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${command.input.Key}`;
  } catch (error) {
    throw new Error("Failed to upload to R2");
  }
};

const create: Interfaces.Controllers.Async = async (req, res, next) => {
  try {
    const { courseId, title, content } = req.body;
    if (!courseId || !title || !content) {
      return res.json(
        Utils.Response.error("courseId, title, and content are required", 400)
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.json(Utils.Response.error("Course not found", 404));
    }

    let attachmentUrl: string | null = null;

    if (req.file) {
      attachmentUrl = await uploadToR2(req.file);
    }

    const announcement = await prisma.announcement.create({
      data: {
        courseId,
        title,
        content,
        attachment: attachmentUrl,
      },
    });

    return res.json(Utils.Response.success(announcement));
  } catch (err) {
    return next(Utils.Response.error((err as Error).message, 500));
  }
};

export default [upload.single("attachment"), create];
