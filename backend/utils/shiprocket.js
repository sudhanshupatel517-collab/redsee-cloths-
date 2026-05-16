const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Get Shiprocket Authentication Token
const getShiprocketToken = async () => {
  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    });
    return response.data.token;
  } catch (error) {
    console.error('Shiprocket Authentication Failed', error.message);
    throw new Error('Failed to authenticate with Shiprocket');
  }
};

// Create a shipment
const createShipment = async (orderData) => {
  try {
    const token = await getShiprocketToken();
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    // Create the custom order payload required by Shiprocket API
    const shiprocketOrder = {
      order_id: orderData._id,
      order_date: new Date().toISOString(),
      pickup_location: "Primary",
      billing_customer_name: orderData.shippingAddress.name || 'Customer',
      billing_last_name: "",
      billing_address: orderData.shippingAddress.street,
      billing_city: orderData.shippingAddress.city,
      billing_pincode: orderData.shippingAddress.zipCode,
      billing_state: orderData.shippingAddress.state,
      billing_country: orderData.shippingAddress.country,
      billing_email: orderData.email || 'customer@example.com',
      billing_phone: orderData.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: orderData.products.map(item => ({
        name: item.product.toString(),
        sku: item.product.toString(),
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: orderData.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      sub_total: orderData.totalAmount,
      length: 10, // mock dimensions
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', shiprocketOrder, config);
    return response.data;
  } catch (error) {
    console.error('Shipment creation failed', error.message);
    throw new Error('Shiprocket order creation failed');
  }
};

module.exports = { createShipment };
