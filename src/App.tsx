
import { useEffect, useState } from 'react';

const WHATSAPP_NUMBER = '213540044167';

const products = [
  { id: 1, name: 'SPORT T-SHIRT', price: '2 500 DA', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85', description: 'T-shirt sportif confortable pour un style quotidien.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Noir', 'Blanc', 'Gris'] },
  { id: 2, name: 'SPORT TRACKSUIT', price: '6 500 DA', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6cbd3?auto=format&fit=crop&w=900&q=85', description: 'Ensemble sportif avec une coupe moderne.', sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Noir', 'Gris'] },
  { id: 3, name: 'SPORT HOODIE', price: '4 800 DA', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85', description: 'Sweat à capuche confortable et moderne.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Noir', 'Blanc', 'Gris'] },
  { id: 4, name: 'SPORT SHORTS', price: '2 200 DA', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=85', description: 'Short léger idéal pour le sport.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Noir', 'Gris'] },
  { id: 5, name: 'SNEAKERS', price: '7 900 DA', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', description: 'Sneakers au design sportif et confortable.', sizes: ['40', '41', '42', '43', '44'], colors: ['Noir', 'Blanc', 'Rouge'] },
  { id: 6, name: 'JOGGING PANTS', price: '3 900 DA', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=85', description: 'Pantalon jogging avec une coupe décontractée.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Noir', 'Gris'] },
];

const wilayas = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna',
  'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira',
  'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou',
  'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
  'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine',
  'Médéa', 'Mostaganem', 'M’Sila', 'Mascara', 'Ouargla',
  'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès',
  'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma',
  'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'Timimoun',
  'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
  'In Salah', 'In Guezzam', 'Touggourt', 'Djanet',
  'El M’Ghair', 'El Meniaa'
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[number] | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProduct, adminOpen]);

  function openProduct(product: typeof products[number]) {
    setSelectedProduct(product);
    setAdminOpen(false);
    setSize('');
    setColor('');
  }

  function goBack() {
    setSelectedProduct(null);
    setAdminOpen(false);
  }

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct || !size || !color) {
      alert('Veuillez choisir la taille et la couleur.');
      return;
    }

    const message = [
      '🛍️ NOUVELLE COMMANDE - ZIZOU STREET',
      '',
      `Produit: ${selectedProduct.name}`,
      `Prix: ${selectedProduct.price}`,
      `Taille: ${size}`,
      `Couleur: ${color}`,
      '',
      `Nom: ${firstName}`,
      `Téléphone: ${phone}`,
      `Wilaya: ${wilaya}`,
      `Commune: ${city}`,
      `Adresse: ${address || 'Non précisée'}`,
      '',
      'Merci !'
    ].join('\n');

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  return (
    <main className="store">
      <header className="site-header">
        <button className="brand" onClick={goBack}>ZIZOU STREET</button>
        <span className="header-caption">SPORT & STREETWEAR</span>
      </header>

      {adminOpen ? (
        <section className="admin-page">
          <button className="back-button" onClick={goBack}>
            ← RETOUR À LA BOUTIQUE
          </button>

          <div className="admin-login-card">
            <p className="eyebrow">ESPACE PRIVÉ</p>
            <h1>ADMIN LOGIN</h1>
            <p className="admin-intro">
              Connectez-vous pour gérer la boutique ZIZOU STREET.
            </p>

            <form
              className="admin-form"
              onSubmit={(event) => {
                event.preventDefault();
                alert('La connexion sera activée après la configuration de Supabase.');
              }}
            >
              <label>
                Adresse e-mail
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(event) => setAdminEmail(event.target.value)}
                  placeholder="Votre adresse e-mail"
                  autoComplete="username"
                />
              </label>

              <label>
                Mot de passe
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                />
              </label>

              <button className="submit-order" type="submit">
                SE CONNECTER
              </button>
            </form>

            <p className="admin-note">
              La connexion sécurisée et la gestion des produits seront activées après le raccordement à Supabase.
            </p>
          </div>
        </section>
      ) : !selectedProduct ? (
        <section className="collection-page">
          <div className="collection-heading">
            <p className="eyebrow">NEW COLLECTION</p>
            <h1>OUR PRODUCTS</h1>
            <p>Discover your style.</p>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <button className="product-card" key={product.id} onClick={() => openProduct(product)}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="view-product">VIEW PRODUCT ↗</span>
                </div>
                <div className="product-card-info">
                  <h2>{product.name}</h2>
                  <p>{product.price}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="detail-page">
          <button className="back-button" onClick={goBack}>← BACK TO COLLECTION</button>

          <div className="detail-layout">
            <div className="detail-photo">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>

            <div className="detail-info">
              <p className="eyebrow">ZIZOU STREET COLLECTION</p>
              <h1>{selectedProduct.name}</h1>
              <p className="detail-price">{selectedProduct.price}</p>
              <p className="detail-description">{selectedProduct.description}</p>

              <div className="option-group">
                <h3>SELECT SIZE</h3>
                <div className="option-list">
                  {selectedProduct.sizes.map((item) => (
                    <button type="button" key={item} className={`option-button ${size === item ? 'active' : ''}`} onClick={() => setSize(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <h3>SELECT COLOR</h3>
                <div className="option-list">
                  {selectedProduct.colors.map((item) => (
                    <button type="button" key={item} className={`option-button ${color === item ? 'active' : ''}`} onClick={() => setColor(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-features">
                <p>✓ Qualité et confort</p>
                <p>✓ Paiement à la livraison</p>
                <p>✓ Livraison disponible</p>
              </div>
            </div>
          </div>

          <section className="checkout-section">
            <div className="checkout-heading">
              <p className="eyebrow">CASH ON DELIVERY</p>
              <h2>COMMANDER MAINTENANT</h2>
              <p>Remplissez vos informations pour confirmer votre commande sur WhatsApp.</p>
            </div>

            <form className="order-form" onSubmit={submitOrder}>
              <label>Nom et prénom
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Votre nom complet" />
              </label>
              <label>Numéro de téléphone
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05 XX XX XX XX" />
              </label>
              <label>Wilaya
                <select required value={wilaya} onChange={(e) => setWilaya(e.target.value)}>
                  <option value="">Choisir votre wilaya</option>
                  {wilayas.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>Commune
                <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Votre commune" />
              </label>
              <label className="full-field">Adresse (facultatif)
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Votre adresse" />
              </label>

              <div className="order-summary">
                <span>{selectedProduct.name}</span>
                <strong>{selectedProduct.price}</strong>
              </div>

              <button className="submit-order" type="submit">CONFIRMER SUR WHATSAPP ↗</button>
            </form>
          </section>

          <section className="related-section">
            <h2>YOU MAY ALSO LIKE</h2>
            <div className="related-grid">
              {products.filter((item) => item.id !== selectedProduct.id).slice(0, 3).map((item) => (
                <button className="product-card" key={item.id} onClick={() => openProduct(item)}>
                  <div className="product-image-wrap">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="product-card-info">
                    <h2>{item.name}</h2>
                    <p>{item.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </section>
      )}

      <footer className="site-footer">
        <p>ZIZOU STREET</p>
        <button className="admin-entry" onClick={() => {
          setSelectedProduct(null);
          setAdminOpen(true);
        }}>
          ADMIN
        </button>
        <span>© 2026 — ALL RIGHTS RESERVED</span>
      </footer>
    </main>
  );
}
