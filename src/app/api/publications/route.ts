import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'publications.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const publications = JSON.parse(fileContent);

  return NextResponse.json(publications);
}