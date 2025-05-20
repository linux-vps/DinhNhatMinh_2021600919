import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadS3Service {
  private s3: S3Client;
  private readonly bucket = 'hrms-toanminh';
  private readonly region = 'ap-southeast-2'; // Đúng region của bucket (Sydney)

  constructor() {
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname);
    const key = `avatars/${uuidv4()}${ext}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3.send(command);
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
} 