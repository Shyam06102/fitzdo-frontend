import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { getAuthToken } from '../utils/auth';

const ProductDetailPage = () => {
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('what');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWhatOpen, setIsWhatOpen] = useState(true);
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${getAuthToken()}`
            }
          }
        );
        const data = await response.json();

        if (response.ok) {
          const transformedProduct = {
            _id: data._id,
            name: data.name || "Product Name",
            price: data.price || 0,
            mrp: data.mrp || 0,
            rating: data.rating || 0,
            reviewCount: data.reviewCount || 0,
            brand: data.brand || "Unknown Brand",
            images: Array.isArray(data.images) && data.images.length > 0
              ? data.images
              : ["https://placehold.co/500x500/e5e7eb/6b7280?text=No+Image"],
            specs: Array.isArray(data.specs)
              ? data.specs
              : [],
            whatInBox: Array.isArray(data.whatInBox)
              ? data.whatInBox
              : [],
            sizes: Array.isArray(data.sizes)
              ? data.sizes
              : ['M'],
            colors: Array.isArray(data.colors)
              ? data.colors
              : [{ name: 'Default', active: true }]
          };

          setProduct(transformedProduct);
        } else {
          setError(data.message || 'Failed to fetch product');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
      navigate("/login");
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <aside className="w-64 bg-white border-r border-gray-200 flex justify-center shrink-0">
          <span className="text-2xl font-bold mt-4 text-orange-500">FITZDO</span>
        </aside>
        <main className="flex-1 flex flex-col">
          <div className="flex items-center justify-center h-screen">
            <div className="text-xl font-medium text-gray-700">Loading product details...</div>
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

  if (!product) {
    return (
      <div className="flex min-h-screen bg-white">
        <aside className="w-64 bg-white border-r border-gray-200 flex justify-center shrink-0">
          <span className="text-2xl font-bold mt-4 text-orange-500">FITZDO</span>
        </aside>
        <main className="flex-1 flex flex-col">
          <div className="flex items-center justify-center h-screen">
            <div className="text-xl font-medium text-red-600">Product not found</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside onClick={() => navigate("/")} className="w-64 bg-white border-r border-gray-200 flex justify-center shrink-0">
        <span className="text-2xl font-bold mt-4 text-orange-500">FITZDO</span>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Product Details</h1>

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

          <nav className="flex items-center mt-3 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="flex items-center">
              <span className="mx-2">/</span>

              <span className="text-gray-900 font-medium capitalize">
                {product.name||'Product Name'}
              </span>

            </span>
          </nav>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
              <div className="lg:col-span-6">
                <div className="relative mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
                    </svg>
                  </button>
                </div>

                <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
                  {product.images.slice(1).map((img, idx) => (
                    <button
                      key={idx}
                      className="flex-shrink-0 w-20 h-20 border-2 border-gray-200 rounded-lg overflow-hidden hover:border-orange-500 focus:outline-none"
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => setIsWhatOpen(!isWhatOpen)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">What’s in the Box?</h3>
                      <button className="text-gray-500 hover:text-gray-700">
                        {isWhatOpen ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {isWhatOpen && (
                      <ul className="mt-3 space-y-2 text-sm text-gray-700">
                        {product.whatInBox.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => setIsSpecOpen(!isSpecOpen)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Product Specification</h3>
                      <button className="text-gray-500 hover:text-gray-700">
                        {isSpecOpen ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {isSpecOpen && (
                      <div className="mt-3 space-y-3">
                        {product.specs.map((spec, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-500">{spec.label}</span>
                            <span className="font-medium text-gray-900">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => setIsAdditionalOpen(!isAdditionalOpen)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                      <button className="text-gray-500 hover:text-gray-700">
                        {isAdditionalOpen ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Delivery & Returns</h3>
                      <button className="text-gray-500 hover:text-gray-700">
                        {isDeliveryOpen ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 shadow p-2">
                <div className="sticky top-6">
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>

                  <div className="flex items-center mb-3">
                    <div className="flex">
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
                    </div>
                    <span className="ml-1 text-sm text-gray-600">
                      {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      M.R.P: ₹{product.mrp.toLocaleString()}
                    </span>
                    <span className="ml-2 inline-block bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Colour: {product.colors[0]?.name || 'Default'}</p>
                    <div className="flex space-x-2">
                      {product.colors.map((color, idx) => (
                        <button
                          key={idx}
                          className={`w-8 h-8 rounded-full border-2 ${color.active
                            ? 'border-black'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                          style={{ backgroundColor: color.name === 'Ashy Slate' ? '#6b7280' : color.name === 'Gunmetal' ? '#374151' : '#1f2937' }}
                          aria-label={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Model: {product.specs.find(spec => spec.label === 'Model')?.value || 'N/A'}</p>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 border text-xs font-medium bg-gray-100 text-gray-800">
                        Force - 4.8HP
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 border text-xs font-medium bg-gray-100 text-gray-800">
                        Force Pro - M...
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 border text-xs font-medium bg-gray-100 text-gray-800">
                        Impact - 4.8HP
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 border text-xs font-medium bg-gray-100 text-gray-800">
                        Impact Ultra...
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
                    <div className="flex space-x-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 text-xs font-medium rounded border ${selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Don’t Know Your Size? <a href="#" className="text-blue-600 hover:underline">Size Guide</a></p>
                  </div>

                  <div className="mb-4 gap-2">
                    <button className="w-full text-black border border-black py-3 px-4 font-bold text-sm hover:bg-gray-200 mb-1 transition-colors">
                      Add to Cart
                    </button>
                    <button className="w-full bg-black text-white py-3 px-4 font-bold text-sm hover:bg-gray-800 transition-colors">
                      Buy Now
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-700 mb-2">Please enter PIN code to check delivery time</p>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Enter PIN code"
                        className="flex-1 px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800">
                        Check
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start mb-4 p-3 bg-green-50 rounded-lg">
                    <svg className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="ml-2 text-sm text-green-800">
                      <span className="font-medium">FREE delivery</span> by Tomorrow 10am<br />
                      Hassle-free 10-day replacement guarantee.
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">Offers & Discounts</h3>
                      <button className="text-xs text-blue-600 hover:underline">See All</button>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">₹</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Flat ₹2000 off</p>
                        <p className="text-xs text-gray-600">
                          Additional flat ₹2000 instant discount on ICICI Bank Credit Cards. Min. purchase ₹10,000.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-16"></div>
      </main>
    </div>
  );
};

export default ProductDetailPage;