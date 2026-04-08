const CATEGORIES = ['Logistik Material', 'Learning Material', 'Office Asset'];

const ProductFilter = ({ search, onSearchChange, category, onCategoryChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Search */}
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or SKU..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <select
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white text-gray-700 min-w-[180px]"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
    </div>
  );
};

export default ProductFilter;
