import * as AWS  from 'aws-sdk'

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})
  
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export function getTodoItemUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration
    })
}

export function getTodoItemAttachmentUrl(todoId: string) {
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`
}

export async function deleteTodoItemAttachment(todoId: string) {
    await s3.deleteObject({
        Bucket: bucketName,
        Key: todoId,
    }).promise()
}
