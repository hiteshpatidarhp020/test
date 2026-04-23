"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditProduct() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    url: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Load product data
useEffect(() => {
  if (!id) return;

  fetch(`/api/products/${id}`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      return res.json();
    })
    .then((data) => {
      setForm({
        name: data.name || "",
        category: data.category || "",
        price: data.price || "",
        description: data.description || "",
        url: data.url || "",
      });
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      alert("Failed to load product");
    });
}, [id]);

  // ✅ Update product
  const handleUpdate = async () => {
    setLoading(true);

    await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
      }),
    });

    alert("Updated ✅");
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="container py-3">
      <h3>Edit Product</h3>

      <input
        className="form-control mb-2"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      />

      <input
        type="number"
        className="form-control mb-2"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
      />

      <textarea
        className="form-control mb-2"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        value={form.url}
        onChange={(e) =>
          setForm({ ...form, url: e.target.value })
        }
      />

      <button
        className="btn btn-primary w-100"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Product"}
      </button>
    </div>
  );
}