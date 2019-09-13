import {S3_BUCKET, S3_REGION, 
    S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY} from '../constants/Constant';
import AWS from 'aws-sdk';

export default function configureAWS() {
    AWS.config.update({
        region: S3_REGION,
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY
    });
    return new AWS.S3({
        params: {Bucket: S3_BUCKET}
    });

    // const config = {
    //     bucketName: S3_BUCKET,
    //     dirName: 'mapview', /* optional */
    //     region: S3_REGION,
    //     accessKeyId: S3_ACCESS_KEY_ID,
    //     secretAccessKey: 'S3_SECRET_ACCESS_KEY,
    // }
    // return config
}