import { NextResponse } from 'next/server';
import { copyFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const EXTERNAL_UPLOAD_DIR = '/home/z/my-project/upload';
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

/**
 * Sync files from the external upload directory to public/uploads/
 * so they become accessible via the /uploads/ static path.
 */
export async function POST() {
  try {
    if (!existsSync(EXTERNAL_UPLOAD_DIR)) {
      return NextResponse.json({
        success: true,
        message: 'No external upload directory',
        synced: 0,
      });
    }

    const files = await readdir(EXTERNAL_UPLOAD_DIR);
    let synced = 0;

    for (const file of files) {
      const srcPath = path.join(EXTERNAL_UPLOAD_DIR, file);
      const destPath = path.join(PUBLIC_UPLOADS_DIR, file);

      // Only copy if the file doesn't already exist in public/uploads
      if (!existsSync(destPath)) {
        try {
          await copyFile(srcPath, destPath);
          synced++;
        } catch {
          // Skip files that can't be copied
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${synced} files from external upload directory`,
      synced,
    });
  } catch (error) {
    console.error('[SYNC_UPLOADS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync uploads' },
      { status: 500 },
    );
  }
}
