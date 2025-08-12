
import {
    S3Client,
    PutObjectCommand,
    CreateBucketCommand,
    DeleteObjectCommand,
    DeleteBucketCommand,
    paginateListObjectsV2,
    GetObjectCommand
} from "@aws-sdk/client-s3";




export async function main() {
    // A region and credentials can be declared explicitly. For example
    // `new S3Client({ region: 'us-east-1', credentials: {...} })` would
    //initialize the client with those settings. However, the SDK will
    // use your local configuration and credentials if those properties
    // are not defined here.
    const s3Client = new S3Client({
        region: 'eu-north-1'
    });

    // Create an Amazon S3 bucket. The epoch timestamp is appended
    // to the name to make it unique.
    const bucketName = `test-bucket-${Date.now()}`;
    await s3Client.send(
        new CreateBucketCommand({
            Bucket: bucketName,
        })
    );

    // Put an object into an Amazon S3 bucket.
    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: "my-first-object.txt",
            Body: "Hello JavaScript SDK!",
        })
    );

    // Read the object.
    const { Body } = await s3Client.send(
        new GetObjectCommand({
            Bucket: bucketName,
            Key: "my-first-object.txt",
        })
    );

    console.log(await Body.transformToString())

}

import { fileURLToPath } from "url";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}