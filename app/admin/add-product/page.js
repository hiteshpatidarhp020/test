"use client";
import { useState } from "react";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    url: "",
  });

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Upload Images
  const handleUpload = async () => {
    if (files.length === 0) return [];

    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        alert("Image upload failed");
        return [];
      }

      const data = await res.json();
      return data.urls || [];
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error");
      return [];
    }
  };

  // ✅ Submit Form
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.url) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const images = await handleUpload();

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          images,
        }),
      });

      if (!res.ok) {
        alert("Failed to save product");
        setLoading(false);
        return;
      }

      alert("Product Saved ✅");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="container py-3">
      <h3 className="mb-3">Add Product</h3>

      <input
        className="form-control mb-2"
        placeholder="Product Name *"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        className="form-control mb-2"
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">Select Category</option>
        <option>Kitchen</option>
        <option>Electronics</option>
      </select>

      <input
        type="number"
        className="form-control mb-2"
        placeholder="Price *"
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <textarea
        className="form-control mb-2"
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        className="form-control mb-2"
        placeholder="Product URL *"
        onChange={(e) => setForm({ ...form, url: e.target.value })}
      />

      {/* ✅ File Upload */}
      <input
        type="file"
        multiple
        accept="image/png, image/jpeg, image/jpg"
        className="form-control"
        onChange={(e) => {
          const selected = [...e.target.files];
          setFiles(selected);
          setPreview(selected.map((f) => URL.createObjectURL(f)));
        }}
      />

      {/* ✅ Preview */}
      <div className="d-flex mt-2 flex-wrap">
        {preview.map((src, i) => (
          <img
            key={i}
            src={src}
            width={70}
            height={70}
            className="me-2 mb-2 rounded"
          />
        ))}
      </div>

      {/* ✅ Button */}
      <button
        className="btn btn-primary mt-3 w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}