const cartItems = [
  { name: "Royal Gold Necklace", price: "PKR 249,000", qty: 1 },
  { name: "Minimal Grace Bracelet", price: "PKR 126,000", qty: 1 }
];

export default function CartPage() {
  return (
    <main className="cart-shell">
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        <section className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.name}>
              <div className="mini-image" />
              <div className="item-meta">
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </div>
              <div className="qty-box">Qty: {item.qty}</div>
            </div>
          ))}
        </section>

        <aside className="summary-box">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>PKR 375,000</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>PKR 2,500</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>PKR 377,500</span>
          </div>
          <a href="/checkout" className="checkout-link">Proceed to Checkout</a>
        </aside>
      </div>
    </main>
  );
}
