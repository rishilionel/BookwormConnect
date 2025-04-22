import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Category } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoriesSection() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (error) {
    return (
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <p>Failed to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl text-neutral-dark mb-2">Shop by Category</h2>
          <p className="text-neutral-gray">Find everything you need for a perfect Diwali celebration</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md festive-border bg-white">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 text-center">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-2/4 mx-auto" />
                </div>
              </div>
            ))
          ) : (
            categories?.map((category) => (
              <Link key={category.id} href={`/products/category/${category.slug}`}>
                <a className="group">
                  <div className="rounded-lg overflow-hidden shadow-md festive-border bg-white transition duration-300 group-hover:shadow-lg">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={category.imageUrl}
                        alt={category.name} 
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-heading font-semibold text-lg text-neutral-dark">{category.name}</h3>
                      <p className="text-sm text-neutral-gray mt-1">{category.description}</p>
                    </div>
                  </div>
                </a>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
