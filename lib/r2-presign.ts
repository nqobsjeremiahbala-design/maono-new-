// Presigned S3-compatible GET URL for an R2 object, using aws4fetch (a tiny,
// battle-tested SigV4 signer for the Workers/fetch runtime). Used to hand video
// playback straight to R2 so the Worker never proxies the (large) bytes — it
// just authorizes + redirects.
//
// Needs an R2 API token (Object Read) exposed as Worker secrets:
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
import { AwsClient } from 'aws4fetch'

export function isR2PresignConfigured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY,
  )
}

export async function presignR2GetUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
  const accountId = process.env.R2_ACCOUNT_ID!
  const accessKeyId = process.env.R2_ACCESS_KEY_ID!
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!

  const client = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' })

  // Encode each path segment but keep the slashes between them.
  const encodedKey = key.split('/').map(encodeURIComponent).join('/')
  const url = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${encodedKey}?X-Amz-Expires=${expiresIn}`

  const signed = await client.sign(url, { method: 'GET', aws: { signQuery: true } })
  return signed.url
}
