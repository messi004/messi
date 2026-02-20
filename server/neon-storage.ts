import { client } from "./db";

export async function uploadImageToDb(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string
): Promise<number> {
    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const [result] = await client`
    INSERT INTO images (filename, mime_type, data, size)
    VALUES (${uniqueFilename}, ${mimetype}, ${fileBuffer}, ${fileBuffer.length})
    RETURNING id
  `;

    return result.id;
}

export async function getImageFromDb(id: number): Promise<{
    filename: string;
    mimeType: string;
    data: Buffer;
    size: number;
} | null> {
    const [image] = await client`
    SELECT filename, mime_type, data, size FROM images WHERE id = ${id}
  `;

    if (!image) return null;

    return {
        filename: image.filename,
        mimeType: image.mime_type,
        data: Buffer.from(image.data),
        size: image.size,
    };
}

export async function deleteImageFromDb(id: number): Promise<void> {
    await client`DELETE FROM images WHERE id = ${id}`;
}
