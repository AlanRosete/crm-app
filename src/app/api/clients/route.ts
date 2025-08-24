import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;

// Función para verificar token y extraer userId
function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string };
  } catch {
    return null;
  }
}

// GET /api/clients -> traer clientes del usuario autenticado
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const clients = await prisma.client.findMany({
      where: { userId: user.userId },
      include: { tasks: true },
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/clients:', error);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}

// POST /api/clients -> crear nuevo cliente asociado al usuario autenticado
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json({ message: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        userId: user.userId,
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/clients:', error);
    return NextResponse.json({ message: 'Error al crear cliente' }, { status: 500 });
  }
}
