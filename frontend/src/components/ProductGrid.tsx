import ProductCard from "./ProductCard";

interface ProductGridProps {
  title?: string;
  products: any[];
}

const ProductGrid = ({ title, products }: ProductGridProps) => {
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
        {products.map((product) => (
          <ProductCard 
            key={product._id}
            id={product._id}
            name={product.name}
            price={product.pricing?.basePrice || 0}
            image={product.images?.[0]?.url || ''}
            hoverImage={product.images?.[1]?.url || product.images?.[0]?.url || ''}
            category={product.category}
            rating={5}
            discount={product.pricing?.discount || 0}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center text-gray-500 font-poppins py-10">
          No products found.
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
