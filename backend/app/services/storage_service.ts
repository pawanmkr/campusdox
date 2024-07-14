import env from '#start/env';
import { MultipartFile } from '@adonisjs/core/bodyparser';
import { Exception } from '@adonisjs/core/exceptions';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'node:fs';
import mime from 'mime';

const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${env.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env.get('CLOUDFLARE_ACCESS_KEY_ID'),
        secretAccessKey: env.get('CLOUDFLARE_SECRET_ACCESS_KEY'),
    },
});

export async function uploadFile(file: MultipartFile, key: string, bucket: string) {
    if (!file.tmpPath) throw new Exception("File's tempPath is missing...");
    const fileStream = createReadStream(file.tmpPath);
    const mimeType = mime.getType(file.tmpPath);

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key, // object name in bucket, ex: 'user/document.pdf'
        Body: fileStream,
        ContentType: mimeType ? mimeType : undefined,
    });

    return (await s3.send(command)).$metadata.httpStatusCode;
}
