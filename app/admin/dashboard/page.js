"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this product?");

    if (!confirmDelete) return;

    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      fetchProducts();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        <div className="admin-header">
          <h2 className="admin-title">
            Products ({products.length})
          </h2>

          <Link
            href="/admin/add-product"
            className="add-product-btn"
          >
            + Add Product
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-box">
            <h5>No Products Found</h5>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => {
                  let image = "";

                  try {
                    const parsed = JSON.parse(p.images || "[]");
                    image = parsed[0];
                  } catch {
                    image = "";
                  }

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="product-info">
                          <img
                            src={image || "/placeholder.jpg"}
                            className="product-thumb"
                            alt="product"
                          />

                          <div>
                            <div className="product-name">
                              {p.name}
                            </div>

                            <div className="product-id">
                              ID: M{p.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="category-badge">
                          {p.category}
                        </span>
                      </td>

                      <td className="price-cell">
                        ₹{p.price}
                      </td>

                      <td>
                        {new Date(p.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td>
                        <div className="action-buttons">
                          <Link
                            href={`/admin/edit-product/${p.id}`}
                            className="edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}