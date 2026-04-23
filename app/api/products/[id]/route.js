import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET single product
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const productId = parseInt(id);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE product
export async function PUT(req, { params }) {
  try {
    const { id } = await params;

    const productId = parseInt(id);

    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id: productId },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

// ✅ DELETE product
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const productId = parseInt(id);

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}