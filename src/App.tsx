
import { useEffect } from 'react';

const products = [
  {
    id: 1,
    name: 'SPORT T-SHIRT',
    price: '2 500 DA',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'SPORT TRACKSUIT',
    price: '6 500 DA',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6cbd3?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'SPORT HOODIE',
    price: '4 800 DA',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'SPORT SHORTS',
    price: '2 200 DA',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    name: 'SNEAKERS',
    price: '7 900 DA',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    name: 'JOGGING PANTS',
    price: '3 900 DA',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=85',
  },
];

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="page">
      <header className="header">
        <a className="logo" href="#">
          ZIZOU <span>STREET</span>
        </a>
        <span className="header-note">SPORTSWEAR</span>
      </header>

      <section className="intro">
        <p className="eyebrow">NEW COLLECTION</p>
        <h1>Move in your style.</h1>
        <p className="intro-copy">
          Discover your everyday sportswear essentials.
        </p>
      </section>

      <section className="catalog">
        <div className="section-heading">
          <h2>Our Collection</h2>
          <span>06 PRODUCTS</span>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product reveal" key={product.id}>
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <strong>ZIZOU STREET</strong>
        <p>SPORTSWEAR FOR EVERY DAY</p>
        <span>© 2026 ZIZOU STREET</span>
      </footer>
    </main>
  );
}
