import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;

function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

    const tasks = await prisma.task.findMany({
    where: {
        client: {
        userId: user.userId,
        },
    },
    });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
    const { title, description, clientId } = body;

    const task = await prisma.task.create({
    data: {
        title,
        description,
        clientId,
    },
    });

  return NextResponse.json(task, { status: 201 });
}
