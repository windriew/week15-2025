
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

// Mengambil koneksi database dari environment variable
const connectionString = process.env.DATABASE_URL ?? "file:./dev.db";

// Membuat adapter untuk menghubungkan Prisma dengan SQLite
const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

// Mencegah pembuatan banyak instance saat development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Menggunakan instance Prisma yang sudah tersedia
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

// Menyimpan instance Prisma selama development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
