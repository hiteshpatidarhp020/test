"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  images: string;
  category: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
const [showSuggestions, setShowSuggestions] = useState(false);
  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch failed:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
const suggestions = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);
  // Initial Load + Back Navigation Refresh
  useEffect(() => {
    fetchProducts();

    const handlePageShow = () => {
      fetchProducts();
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  // Categories
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category || "Other")),
  ];

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div >
      {/* Header */}
<div className="custom-header">
  <div className="header-left">
    <div className="logo-box">
      <img src="/logo.png" alt="Logo" />
    </div>

  </div>

  <div className="header-right">
    <span className="premium-text">
      Premium<br />Store
    </span>
  </div>
</div>
<div className="container py-3">
      {/* Header */}
     

      {/* Search */}
   <div className="position-relative  mb-3">
  <input
    type="text"
    className="seacr-bar"
    placeholder="Search products..."
    value={search}
    onFocus={() => setShowSuggestions(true)}
    onChange={(e) => {
      setSearch(e.target.value);
      setShowSuggestions(true);
    }}
  />

  {showSuggestions && search && (
    <div className="search-dropdown shadow-sm">
      {suggestions.length > 0 ? (
        suggestions.slice(0, 8).map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="search-item"
            onClick={() => setShowSuggestions(false)}
          >
            {product.name}
          </Link>
        ))
      ) : (
        <div className="search-empty">
          No products found
        </div>
      )}
    </div>
  )}
</div>

      {/* Categories */}
      <div className="category-scroll mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${
              activeCategory === cat ? "active-category" : ""
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
<h4 className="my-3 d-flex star-icon align-items-center mt-4">
  <div className="star-animation">
    <img src="/stars.png" alt="Forward" className="star-forward" />
    <img src="/stars.png" alt="Return" className="star-return" />
  </div>

  <span>
    {activeCategory === "All"
      ? "All Products"
      : `${activeCategory} Products`}
  </span>
</h4>
      {/* Loading */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border"></div>
        </div>
      ) : (
        <div className="row px-2">
          {filteredProducts.map((product) => {
            let image = "";

            try {
              const parsed = JSON.parse(product.images);
              image = parsed?.[0] || "";
            } catch {
              image = "";
            }

              return (
    <div className="col-6 mb-4 px-0 gird-card" key={product.id}>
      <Link
        href={`/product/${product.id}`}
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 rounded-4 overflow-hidden product-card mx-2">
          <img
            src={image || "/placeholder.jpg"}
            className="w-100"
            style={{
              height: "190px",
              objectFit: "cover",
            }}
          />

          <div className="p-2 mt-2 pe-2 price-tag">
            <h6 className="mb-1 product-title title">
              {product.name}
            </h6>

            <p className="fw-bold mb-0">
              ₹{product.price}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
          })}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center mt-5">
          <h6>No products found</h6>
        </div>
      )}
    </div>
    </div>
  );
}