import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const productId = parseInt(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return <div className="container py-5">Product not found</div>;
  }

  // ✅ Related products (same category)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: {
        id: productId,
      },
    },
    take: 6,
  });

  // ✅ Remaining products
const moreProducts = await prisma.product.findMany({
  where: {
    AND: [
      {
        NOT: {
          id: productId,
        },
      },
      {
        NOT: {
          category: product.category,
        },
      },
    ],
  },
  take: 10,
});

  const images = JSON.parse(product.images || "[]");

  return (
    <div className="container py-3">
      <div className="mb-3">
  <Link
    href="/"
    className="btn btn-light border rounded-pill px-3"
  >
    ← Back to Shop
  </Link>
</div>
      {/* Product Detail */}
      <div className="card dital-cards border-0 shadow-sm rounded-4 p-3">
        {/* Images */}
        <div className="mb-3">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-100 rounded mb-2"
              style={{
              
                objectFit: "cover",
              }}
            />
          ))}
        </div>

        {/* Product Info */}
        <h3 >{product.name}</h3>

        <h4 className="text-success ">
          ₹{product.price}
        </h4>

        <p>{product.description}</p>

        <a
          href={product.url}
          target="_blank"
          className="btn btn-dark w-100 mb-2 rounded-pill mt-2"
        >
          Buy Now
        </a>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">Related Products</h4>

          <div className="row px-2">
            {relatedProducts.map((item) => {
              const imgs = JSON.parse(item.images || "[]");

              return (
                <div className="col-6 mb-4 px-0 gird-card" key={item.id}>
                  <Link
                    href={`/product/${item.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="card h-100 rounded-4 overflow-hidden product-card mx-2">
                      <img
                        src={imgs[0]}
                        className="w-100"
                        style={{
                          height: "190px",
                          objectFit: "cover",
                        }}
                      />

                      <div className="p-2 mt-2 pe-2 price-tag">
                        <h6>{item.name}</h6>
                        <p className="fw-bold mb-0">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* More Products */}
      <div className="mt-4">
        <h4 className="mb-3">More Products</h4>

        <div className="row px-2">
          {moreProducts.map((item) => {
            const imgs = JSON.parse(item.images || "[]");

            return (
              <div className="col-6 mb-4 px-0 gird-card" key={item.id}>
                <Link
                  href={`/product/${item.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card h-100 rounded-4 overflow-hidden product-card mx-2">
                    <img
                      src={imgs[0]}
                      className="w-100"
                      style={{
                        height: "190px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="p-2 mt-2 pe-2 price-tag">
                      <h6>{item.name}</h6>
                      <p className="fw-bold mb-0">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}