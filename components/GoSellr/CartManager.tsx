import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiCreditCard, FiLock } from 'react-icons/fi';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  image: string;
  shop: {
    id: string;
    name: string;
    verified: boolean;
  };
  sqlRequired: 'free' | 'basic' | 'normal' | 'high';
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Mock data - replace with API calls
const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: '1',
    name: 'Premium Laptop',
    price: 999,
    currency: 'USD',
    quantity: 1,
    image: '/products/laptop.jpg',
    shop: {
      id: '1',
      name: 'Tech Haven',
      verified: true,
    },
    sqlRequired: 'normal',
  },
  {
    id: '2',
    productId: '2',
    name: 'Designer Watch',
    price: 299,
    currency: 'USD',
    quantity: 2,
    image: '/products/watch.jpg',
    shop: {
      id: '2',
      name: 'Luxury Timepieces',
      verified: true,
    },
    sqlRequired: 'basic',
  },
];

export default function CartManager() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      setCartItems(items =>
        items.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    return 10; // Mock shipping cost
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Implement checkout logic
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500">Add some products to your cart to continue shopping.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.shop.name}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          SQL {item.sqlRequired}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {item.currency} {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {cartItems[0].currency} {calculateSubtotal()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {cartItems[0].currency} {calculateShipping()}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {cartItems[0].currency} {calculateTotal()}
                    </span>
                  </div>
                </div>

                {/* Shipping Address Form */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Shipping Address</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={shippingAddress.fullName}
                      onChange={e => handleAddressChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={shippingAddress.address}
                      onChange={e => handleAddressChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={e => handleAddressChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={shippingAddress.state}
                        onChange={e => handleAddressChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={shippingAddress.zipCode}
                        onChange={e => handleAddressChange('zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={shippingAddress.country}
                        onChange={e => handleAddressChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  <FiCreditCard className="w-5 h-5" />
                  <span>{isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}</span>
                </button>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <FiLock className="w-4 h-4" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
