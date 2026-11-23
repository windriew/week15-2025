
"use client";

import { useEffect, useState } from "react";

// Struktur data produk
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
}

// Halaman utama Manajemen Produk
export default function Home() {
  // Menyimpan daftar produk
  const [products, setProducts] = useState<Product[]>([]);

  // Menyimpan input form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Menyimpan ID produk yang sedang diedit
  const [editId, setEditId] = useState<number | null>(null);

  // Menyimpan pesan informasi
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Mengambil data produk dari API
  async function fetchProducts() {
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Gagal mengambil produk");
      }

      const data = await response.json();
      setProducts(data);
    } catch {
      setMessage("Gagal mengambil data produk.");
    }
  }

  // Mengambil data ketika halaman pertama kali dibuka
  useEffect(() => {
  async function loadProducts() {
    await fetchProducts();
  }

  loadProducts();
}, []);

  // Membersihkan form
  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setEditId(null);
  }

  // Menambahkan atau memperbarui produk
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !name.trim() ||
      price === "" ||
      stock === "" ||
      Number(price) < 0 ||
      !Number.isFinite(Number(price)) ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      setMessage("Periksa kembali data produk.");
      return;
    }

    setLoading(true);
    setMessage("");

    const productData = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
    };

    try {
      const url = editId
        ? `/api/products/${editId}`
        : "/api/products";

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan produk");
      }

      setMessage(
        editId
          ? "Produk berhasil diperbarui!"
          : "Produk berhasil ditambahkan!"
      );

      resetForm();
      await fetchProducts();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  // Mengisi form dengan data produk yang dipilih
  function handleEdit(product: Product) {
    setEditId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(String(product.price));
    setStock(String(product.stock));
    setMessage("");
  }

  // Menghapus produk
  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setMessage("Produk berhasil dihapus!");
      await fetchProducts();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menghapus produk."
      );
    }
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Manajemen Produk</h1>
      <p>Kelola data produk menggunakan Next.js, Prisma, dan SQLite.</p>

      {/* Form tambah dan edit produk */}
      <section
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h2>{editId ? "Edit Produk" : "Tambah Produk"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Nama Produk</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama produk"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi produk"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Harga</label>
            <input
              type="number"
              min="0"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Masukkan harga"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Stok</label>
            <input
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Masukkan jumlah stok"
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? "Menyimpan..."
              : editId
                ? "Simpan Perubahan"
                : "Tambah Produk"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "10px" }}
            >
              Batal
            </button>
          )}
        </form>

        {message && <p>{message}</p>}
      </section>

      {/* Daftar produk */}
      <section>
        <h2>Daftar Produk</h2>

        {products.length === 0 ? (
          <p>Belum ada produk. Silakan tambahkan produk baru.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={cellStyle}>ID</th>
                  <th style={cellStyle}>Nama</th>
                  <th style={cellStyle}>Deskripsi</th>
                  <th style={cellStyle}>Harga</th>
                  <th style={cellStyle}>Stok</th>
                  <th style={cellStyle}>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={cellStyle}>{product.id}</td>
                    <td style={cellStyle}>{product.name}</td>
                    <td style={cellStyle}>
                      {product.description || "-"}
                    </td>
                    <td style={cellStyle}>
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td style={cellStyle}>{product.stock}</td>
                    <td style={cellStyle}>
                      <button onClick={() => handleEdit(product)}>
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{ marginLeft: "5px" }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

// Style untuk input
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  boxSizing: "border-box" as const,
};

// Style untuk tabel
const cellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left" as const,
};
