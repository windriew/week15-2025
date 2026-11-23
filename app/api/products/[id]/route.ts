
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// UPDATE: Mengubah data produk
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, price, stock } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        { message: "Data produk tidak valid" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name.trim(),
        description:
          typeof description === "string"
            ? description.trim() || null
            : null,
        price,
        stock,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Gagal mengubah produk:", error);

    return NextResponse.json(
      { message: "Produk tidak ditemukan atau gagal diperbarui" },
      { status: 404 }
    );
  }
}

// DELETE: Menghapus produk
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("Gagal menghapus produk:", error);

    return NextResponse.json(
      { message: "Produk tidak ditemukan atau gagal dihapus" },
      { status: 404 }
    );
  }
}
