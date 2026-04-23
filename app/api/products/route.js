import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req) {
  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      ...body,
      images: JSON.stringify(body.images),
    },
  });

  return NextResponse.json(product);
}