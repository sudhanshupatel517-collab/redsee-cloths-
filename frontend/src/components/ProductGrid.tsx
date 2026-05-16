import ProductCard from "./ProductCard";
import { mockProducts } from "@/lib/data";

const ProductGrid = ({ title, limit = 8 }: { title?: string; limit?: number }) => {
  const displayProducts = mockProducts.slice(0, limit);

  return (
    <section className="py-20 px-6 container mx-auto">
      {title && (
        <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-4">
          <h2 className="text-4xl font-bebas tracking-wider text-white">
            {title}
          </h2>
          <a href="/shop" className="text-sm font-montserrat uppercase tracking-widest text-gray-400 hover:text-[#ff0033] transition-colors">
            View All
          </a>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
