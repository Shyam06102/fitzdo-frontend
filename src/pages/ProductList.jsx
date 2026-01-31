import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { getAuthToken } from '../utils/auth';
const FullProductListPage = () => {
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
      navigate("/login");
    }
  };

  const fetchProducts = async (page = 1, sortBy = '', search = '') => {
    try {
      setLoading(true);

      let queryParams = `?page=${page}&limit=20`;
      if (sortBy) queryParams += `&sort=${sortBy}`;
      if (search) queryParams += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products${queryParams}`,
        {
          method:'GET',
          headers:{
            Authorization:`Bearer ${getAuthToken()}`
          }
        }
      );
      const data = await response.json();

      if (response.ok) {
        const transformedProducts = data.products.map((item, index) => ({
          id: item._id || index + 1,
          image: Array.isArray(item.images) && item.images.length > 0
            ? item.images[0]
            : "https://placehold.co/260x260/e5e7eb/6b7280?text=Product",
          sponsor: "FitZdo Sponsored",
          brand: item.brand || "Unknown Brand",
          title: item.name || "Product Title",
          rating: item.rating || 0,
          reviewCount: item.reviewCount || 0,
          discount: Math.round(((item.mrp - item.price) / item.mrp) * 100) || 0,
          price: item.price || 0,
          mrp: item.mrp || item.price || 0,
          delivery: "Tomorrow 10pm",
        }));

        setProducts(transformedProducts);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.totalProducts || 0);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, sortOption, searchQuery);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts(1, sortOption, searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery === '') {
      fetchProducts(1, sortOption, searchQuery);
    }
  }, [sortOption]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage, sortOption, searchQuery);
    }
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-screen bg-white">
        <aside className="w-64 bg-white border-r border-gray-200 flex justify-center shrink-0">
          <span className="text-2xl font-bold mt-4 text-orange-500">FITZDO</span>
        </aside>
        <main className="flex-1 flex flex-col">
          <div className="flex items-center justify-center h-screen">
            <div className="text-xl font-medium text-gray-700">Loading products...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <aside className="w-64 bg-white border-r border-gray-200 flex justify-center shrink-0">
          <span className="text-2xl font-bold mt-4 text-orange-500">FITZDO</span>
        </aside>
        <main className="flex-1 flex flex-col">
          <div className="flex items-center justify-center h-screen">
            <div className="text-xl font-medium text-red-600">{error}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 bg-white border-r border-gray-200 flex justify-center shrink-0">
        <span className="text-2xl font-bold mt-4 text-orange-500 ">FITZDO</span>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Product List</h1>

            <div className="flex-1 mx-8 max-w-2xl items-end">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-1/2 pl-10 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="flex flex-col items-end relative" ref={menuRef}>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Tony Stark Jr.</p>
                  <p className="text-xs text-gray-500">Super-Admin</p>
                </div>
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              </div>

              {showMenu && (
                <div className="absolute top-12 right-0 w-32 bg-white border border-gray-200 rounded-md shadow-md z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <hr className="mt-2"></hr>

          <div className="flex justify-between mt-3">
            <div className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * 20 + 1, totalProducts)} - {Math.min(currentPage * 20, totalProducts)} of {totalProducts} results
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-gray-100 text-gray-700 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="">Default Sorting</option>
                <option value="newest">Newest</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
              </select>
              <svg
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </header>

        <div className="flex-1 p-2 rounder-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Results for <span className="font-semibold">"Fitness & Training"</span>
            </h2>
            <p className="text-sm text-gray-500 mt-2 sm:mt-0">
              {totalProducts} Results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {products.map((product) => (
              <div key={product.id} onClick={() => navigate(`/products/${product.id}`)} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-2 text-center items-center px-2 py-1 rounded text-xs font-medium text-gray-700 border border-gray-200">
                    {product.sponsor}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {product.brand}
                  </p>

                  <h3 className="text-sm font-medium text-gray-900 mt-1 line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.951.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-.18 1.81-.588 1.81h-3.461a1 1 0 00-.951.69l-1.07 3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-xs text-gray-600">
                      {product.rating} ({product.reviewCount.toLocaleString()})
                    </span>&nbsp;
                    <div className="top-2 right-2 bg-blue-500 text-white text-xs px-1 py-1 rounded">
                      -{product.discount}%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 mb-2">
                    FREE delivery by Tomorrow 10pm
                  </p>
                  <hr></hr>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      M.R.P: <span className="line-through">₹{product.mrp.toLocaleString()}</span>
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;

                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${currentPage === pageNum
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Next
              </button>
            </nav>
          </div>

          <div className="text-center mt-2 text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="h-16"></div>
      </main>
    </div>
  );
};

export default FullProductListPage;