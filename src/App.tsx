
import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from './lib/supabase';

const WHATSAPP_NUMBER = '213540044167';
const PAGE_SIZE = 10;

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
};

const initialProducts: Omit<Product, 'id'>[] = [
  {
    name: 'SPORT T-SHIRT',
    price: '2 500 DA',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
    description: 'T-shirt sportif confortable pour un style quotidien.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Blanc', 'Gris']
  },
  {
    name: 'SPORT TRACKSUIT',
    price: '6 500 DA',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6cbd3?auto=format&fit=crop&w=900&q=85',
    description: 'Ensemble sportif avec une coupe moderne.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Noir', 'Gris']
  },
  {
    name: 'SPORT HOODIE',
    price: '4 800 DA',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
    description: 'Sweat à capuche confortable et moderne.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Blanc', 'Gris']
  },
  {
    name: 'SPORT SHORTS',
    price: '2 200 DA',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=85',
    description: 'Short léger idéal pour le sport.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Gris']
  },
  {
    name: 'SNEAKERS',
    price: '7 900 DA',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
    description: 'Sneakers au design sportif et confortable.',
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Noir', 'Blanc', 'Rouge']
  },
  {
    name: 'JOGGING PANTS',
    price: '3 900 DA',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=85',
    description: 'Pantalon jogging avec une coupe décontractée.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Gris']
  }
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

const emptyForm = {
  name: '',
  price: '',
  description: '',
  sizes: 'S, M, L, XL',
  colors: 'Noir, Blanc, Gris'
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // استرجاع وتغيير كلمة المرور
  const [resetMode, setResetMode] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  async function loadProducts() {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      alert('Erreur lors du chargement des produits.');
      setLoadingProducts(false);
      return;
    }

    if (data && data.length > 0) {
      setProducts(data as Product[]);
    } else {
      setProducts([]);
    }

    setLoadingProducts(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // استقبال رابط استرجاع كلمة المرور من Supabase
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        setResetMode(false);
        setAdminOpen(true);
        setSelectedProduct(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProduct, adminOpen, page]);

  // إرسال رابط استرجاع كلمة المرور
  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminEmail.trim()) {
      alert('Veuillez saisir votre adresse e-mail.');
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        adminEmail.trim(),
        {
          redirectTo: window.location.origin
        }
      );

      if (error) throw error;

      alert('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
      setResetMode(false);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Une erreur est survenue.';

      alert('Erreur : ' + message);
    } finally {
      setResetLoading(false);
    }
  }

  // حفظ كلمة المرور الجديدة
  async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      await supabase.auth.signOut();

      setRecoveryMode(false);
      setResetMode(false);
      setAdminLoggedIn(false);
      setAdminPassword('');
      setNewPassword('');
      setConfirmPassword('');

      alert('Mot de passe modifié avec succès. Connectez-vous avec votre nouveau mot de passe.');
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Une erreur est survenue.';

      alert('Erreur : ' + message);
    } finally {
      setResetLoading(false);
    }
  }

  async function handleAdminLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword
      });

      if (error) throw error;

      if (!data.user?.email) {
        throw new Error('Impossible de vérifier votre compte.');
      }

      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('email')
        .eq('email', data.user.email)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!admin) {
        await supabase.auth.signOut();
        throw new Error("Ce compte n'a pas les autorisations administrateur.");
      }

      setAdminEmail(data.user.email);
      setAdminLoggedIn(true);
      setAdminPassword('');

      // Importer les six anciens produits uniquement si la table est vide.
      const { data: existing, error: checkError } = await supabase
        .from('products')
        .select('id')
        .limit(1);

      if (checkError) throw checkError;

      if (!existing || existing.length === 0) {
        const { error: seedError } = await supabase
          .from('products')
          .insert(initialProducts);

        if (seedError) throw seedError;
      }

      await loadProducts();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Une erreur est survenue.';

      alert('Échec de connexion : ' + message);
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setAdminLoggedIn(false);
    setAdminEmail('');
    setAdminPassword('');
    setAdminOpen(false);
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setAdminOpen(false);
    setSize('');
    setColor('');
  }

  function goBack() {
    setSelectedProduct(null);
    setAdminOpen(false);
    setResetMode(false);
    setRecoveryMode(false);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);

    const input = document.getElementById('product-image') as HTMLInputElement | null;
    if (input) input.value = '';
  }

  function editProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', ')
    });
    setImageFile(null);

    document.getElementById('product-editor')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.price.trim()) {
      alert('Veuillez saisir le nom et le prix.');
      return;
    }

    setSaving(true);

    try {
      let imageUrl = '';

      if (editingId) {
        imageUrl = products.find(p => p.id === editingId)?.image || '';
      }

      if (imageFile) {
        const extension = imageFile.name.split('.').pop() || 'jpg';
        const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicData.publicUrl;
      }

      const productData = {
        name: form.name.trim(),
        price: form.price.trim(),
        description: form.description.trim(),
        image: imageUrl,
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(c => c.trim()).filter(Boolean)
      };

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);

        if (error) throw error;

        alert('تم تعديل المنتج بنجاح.');
      } else {
        if (!imageUrl) {
          throw new Error('يرجى اختيار صورة للمنتج.');
        }

        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;

        alert('تمت إضافة المنتج بنجاح.');
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Une erreur est survenue.';

      alert('خطأ: ' + message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `هل تريد حذف المنتج ${product.name}؟`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (error) {
      alert('تعذر حذف المنتج: ' + error.message);
      return;
    }

    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
    }

    await loadProducts();
    alert('تم حذف المنتج.');
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
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

    window.location.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));

  const visibleProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <main className="store">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; background: #fff; color: #111; }
        button, input, select, textarea { font: inherit; }
        button { cursor: pointer; }
        .store { min-height: 100vh; background: #fff; }
        .site-header { min-height: 76px; padding: 18px 5%; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .brand { background: none; border: 0; font-size: 25px; font-weight: 900; letter-spacing: 2px; color: #111; }
        .header-caption { font-size: 11px; letter-spacing: 2px; color: #777; }
        .collection-page, .detail-page, .admin-page { max-width: 1250px; margin: auto; padding: 45px 5%; }
        .collection-heading { text-align: center; margin: 10px 0 40px; }
        .eyebrow { color: #888; font-size: 11px; letter-spacing: 3px; font-weight: bold; }
        .collection-heading h1, .admin-login-card h1 { font-size: clamp(28px, 5vw, 48px); letter-spacing: 2px; margin: 12px 0; }
        .collection-heading p:last-child { color: #777; }
        .product-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 25px 18px; }
        .product-card { padding: 0; border: 0; background: white; text-align: left; color: #111; min-width: 0; }
        .product-image-wrap { position: relative; overflow: hidden; background: #f4f4f4; aspect-ratio: 4 / 5; }
        .product-image-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s; }
        .product-card:hover img { transform: scale(1.04); }
        .view-product { position: absolute; bottom: 12px; left: 12px; background: white; padding: 9px 12px; font-size: 10px; letter-spacing: 1px; }
        .product-card-info { padding: 12px 2px; }
        .product-card-info h2 { font-size: 14px; margin: 0 0 8px; }
        .product-card-info p { margin: 0; font-weight: bold; font-size: 14px; }
        .detail-page { padding-top: 25px; }
        .back-button { background: none; border: 0; padding: 12px 0; font-size: 12px; font-weight: bold; letter-spacing: 1px; }
        .detail-layout { display: grid; grid-template-columns: 1.1fr 1fr; gap: 45px; margin-top: 20px; }
        .detail-photo { background: #f4f4f4; }
        .detail-photo img { display: block; width: 100%; max-height: 700px; object-fit: cover; }
        .detail-info { padding: 15px 0; }
        .detail-info h1 { font-size: clamp(26px, 4vw, 42px); margin: 12px 0; }
        .detail-price { font-size: 22px; font-weight: bold; }
        .detail-description { color: #666; line-height: 1.7; }
        .option-group { margin: 25px 0; }
        .option-group h3 { font-size: 12px; letter-spacing: 1px; }
        .option-list { display: flex; flex-wrap: wrap; gap: 9px; }
        .option-button { border: 1px solid #ddd; background: white; padding: 11px 16px; }
        .option-button.active { background: #111; color: white; border-color: #111; }
        .product-features { margin-top: 28px; color: #555; font-size: 13px; line-height: 1.8; }
        .checkout-section { margin: 65px auto; max-width: 800px; border-top: 1px solid #eee; padding-top: 35px; }
        .checkout-heading { text-align: center; margin-bottom: 25px; }
        .checkout-heading h2 { font-size: 25px; }
        .checkout-heading p:last-child { color: #777; font-size: 13px; }
        .order-form, .admin-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .order-form label, .admin-form label, .product-editor label { display: flex; flex-direction: column; gap: 8px; font-size: 12px; font-weight: bold; }
        .order-form input, .order-form select, .admin-form input, .product-editor input, .product-editor textarea { width: 100%; padding: 14px; border: 1px solid #ddd; border-radius: 0; background: white; min-width: 0; }
        .full-field { grid-column: 1 / -1; }
        .order-summary { grid-column: 1 / -1; display: flex; justify-content: space-between; padding: 18px 0; border-top: 1px solid #eee; }
        .submit-order { grid-column: 1 / -1; padding: 17px; background: #111; color: white; border: 0; font-weight: bold; letter-spacing: 1px; }
        .submit-order:disabled { opacity: .5; cursor: not-allowed; }
        .related-section { margin-top: 60px; }
        .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .site-footer { padding: 35px 5%; background: #111; color: white; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; font-size: 11px; letter-spacing: 1px; }
        .site-footer p { font-weight: 900; font-size: 17px; }
        .admin-entry { border: 1px solid #555; background: transparent; color: white; padding: 10px 18px; }
        .admin-page { min-height: 65vh; }
        .admin-login-card { max-width: 650px; margin: 35px auto; padding: 30px; border: 1px solid #eee; }
        .admin-intro, .admin-note { color: #777; font-size: 13px; line-height: 1.6; }
        .admin-form { grid-template-columns: 1fr; margin-top: 25px; }
        .forgot-button { display: block; margin: 15px auto 0; padding: 10px; border: 0; background: transparent; color: #555; text-decoration: underline; font-size: 13px; }
        .admin-dashboard { max-width: 1000px; margin: 25px auto; }
        .admin-top { display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; margin-bottom: 25px; }
        .admin-top h1 { font-size: 26px; }
        .admin-logout { padding: 12px 18px; border: 1px solid #111; background: white; }
        .product-editor { padding: 25px; border: 1px solid #ddd; margin-bottom: 35px; display: grid; gap: 15px; }
        .product-editor h2 { margin: 0 0 8px; }
        .product-editor textarea { min-height: 90px; resize: vertical; }
        .admin-products { display: grid; gap: 12px; }
        .admin-product { display: grid; grid-template-columns: 85px 1fr auto; gap: 15px; align-items: center; padding: 12px; border: 1px solid #eee; }
        .admin-product img { width: 85px; height: 95px; object-fit: cover; background: #eee; }
        .admin-product h3 { font-size: 14px; margin: 0 0 7px; }
        .admin-product p { font-size: 13px; color: #777; margin: 0; }
        .admin-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .admin-actions button { padding: 9px 12px; border: 1px solid #ddd; background: white; font-size: 12px; }
        .admin-actions .delete-button { color: #b00020; }
        .pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin: 30px 0; }
        .pagination button { border: 1px solid #ddd; background: white; padding: 10px 16px; }
        .pagination button:disabled { opacity: .35; cursor: not-allowed; }
        .empty-message { padding: 30px; text-align: center; color: #777; }
        .loading-message { text-align: center; padding: 50px; color: #777; }
        @media (max-width: 700px) {
          .site-header { padding: 15px 4%; }
          .brand { font-size: 20px; }
          .header-caption { font-size: 9px; letter-spacing: 1px; }
          .collection-page, .detail-page, .admin-page { padding: 25px 4%; }
          .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 10px; }
          .product-card-info h2 { font-size: 12px; }
          .detail-layout { grid-template-columns: 1fr; gap: 20px; }
          .order-form { grid-template-columns: 1fr; }
          .full-field, .order-summary, .submit-order { grid-column: 1; }
          .related-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-login-card { padding: 20px; }
          .admin-product { grid-template-columns: 65px 1fr; }
          .admin-product img { width: 65px; height: 75px; }
          .admin-actions { grid-column: 1 / -1; }
          .site-footer { justify-content: center; text-align: center; }
        }
      `}</style>

      <header className="site-header">
        <button className="brand" onClick={goBack}>ZIZOU STREET</button>
        <span className="header-caption">SPORT & STREETWEAR</span>
      </header>

      {adminOpen ? (
        <section className="admin-page">
          <button className="back-button" onClick={goBack}>
            ← RETOUR À LA BOUTIQUE
          </button>

          {recoveryMode ? (
            <div className="admin-login-card">
              <p className="eyebrow">SÉCURITÉ DU COMPTE</p>
              <h1>NOUVEAU MOT DE PASSE</h1>
              <p className="admin-intro">
                Choisissez un nouveau mot de passe pour votre compte administrateur.
              </p>

              <form className="admin-form" onSubmit={handleUpdatePassword}>
                <label>
                  Nouveau mot de passe
                  <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                  />
                </label>

                <label>
                  Confirmer le mot de passe
                  <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez le mot de passe"
                  />
                </label>

                <button className="submit-order" type="submit" disabled={resetLoading}>
                  {resetLoading ? 'ENREGISTREMENT...' : 'CHANGER LE MOT DE PASSE'}
                </button>
              </form>
            </div>
          ) : resetMode ? (
            <div className="admin-login-card">
              <p className="eyebrow">RÉCUPÉRATION DU COMPTE</p>
              <h1>MOT DE PASSE OUBLIÉ</h1>
              <p className="admin-intro">
                Saisissez votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              <form className="admin-form" onSubmit={handleForgotPassword}>
                <label>
                  Adresse e-mail
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    placeholder="Votre adresse e-mail"
                    autoComplete="email"
                  />
                </label>

                <button className="submit-order" type="submit" disabled={resetLoading}>
                  {resetLoading ? 'ENVOI...' : 'ENVOYER LE LIEN'}
                </button>

                <button
                  type="button"
                  className="admin-logout"
                  onClick={() => setResetMode(false)}
                >
                  RETOUR À LA CONNEXION
                </button>
              </form>
            </div>
          ) : !adminLoggedIn ? (
            <div className="admin-login-card">
              <p className="eyebrow">ESPACE PRIVÉ</p>
              <h1>ADMIN LOGIN</h1>
              <p className="admin-intro">
                Connectez-vous pour gérer la boutique ZIZOU STREET.
              </p>

              <form className="admin-form" onSubmit={handleAdminLogin}>
                <label>
                  Adresse e-mail
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
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
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                  />
                </label>

                <button className="submit-order" disabled={loginLoading}>
                  {loginLoading ? 'CONNEXION...' : 'SE CONNECTER'}
                </button>
              </form>

              <button
                type="button"
                className="forgot-button"
                onClick={() => setResetMode(true)}
              >
                Mot de passe oublié ?
              </button>

              <p className="admin-note">Accès réservé à l'administrateur autorisé.</p>
            </div>
          ) : (
            <div className="admin-dashboard">
              <div className="admin-top">
                <div>
                  <p className="eyebrow">ESPACE ADMINISTRATEUR</p>
                  <h1>PRODUCT MANAGEMENT</h1>
                  <p className="admin-intro">{adminEmail}</p>
                </div>
                <button className="admin-logout" onClick={handleLogout}>
                  SE DÉCONNECTER
                </button>
              </div>

              <form id="product-editor" className="product-editor" onSubmit={saveProduct}>
                <h2>{editingId ? 'MODIFIER LE PRODUIT' : 'AJOUTER UN PRODUIT'}</h2>

                <label>
                  Nom du produit
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: SPORT T-SHIRT"
                  />
                </label>

                <label>
                  Prix
                  <input
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="Ex: 2 500 DA"
                  />
                </label>

                <label>
                  Description
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Description du produit"
                  />
                </label>

                <label>
                  Tailles (séparez par une virgule)
                  <input
                    value={form.sizes}
                    onChange={e => setForm({ ...form, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                  />
                </label>

                <label>
                  Couleurs (séparez par une virgule)
                  <input
                    value={form.colors}
                    onChange={e => setForm({ ...form, colors: e.target.value })}
                    placeholder="Noir, Blanc, Gris"
                  />
                </label>

                <label>
                  Photo du produit
                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                    required={!editingId}
                  />
                </label>

                <button className="submit-order" type="submit" disabled={saving}>
                  {saving ? 'ENREGISTREMENT...' : editingId ? 'ENREGISTRER LES MODIFICATIONS' : 'AJOUTER LE PRODUIT'}
                </button>

                {editingId && (
                  <button type="button" className="admin-logout" onClick={resetForm}>
                    ANNULER LA MODIFICATION
                  </button>
                )}
              </form>

              <h2>MES PRODUITS ({products.length})</h2>

              {loadingProducts ? (
                <p className="loading-message">Chargement...</p>
              ) : products.length === 0 ? (
                <p className="empty-message">Aucun produit pour le moment.</p>
              ) : (
                <div className="admin-products">
                  {visibleProducts.map(product => (
                    <div className="admin-product" key={product.id}>
                      <img src={product.image} alt={product.name} />
                      <div>
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                      </div>
                      <div className="admin-actions">
                        <button onClick={() => editProduct(product)}>
                          MODIFIER
                        </button>
                        <button className="delete-button" onClick={() => deleteProduct(product)}>
                          SUPPRIMER
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination">
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    PRÉCÉDENT
                  </button>
                  <span>{page} / {totalPages}</span>
                  <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                    SUIVANT
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      ) : !selectedProduct ? (
        <section className="collection-page">
          <div className="collection-heading">
            <p className="eyebrow">NEW COLLECTION</p>
            <h1>OUR PRODUCTS</h1>
            <p>Discover your style.</p>
          </div>

          {loadingProducts ? (
            <p className="loading-message">Chargement des produits...</p>
          ) : products.length === 0 ? (
            <p className="empty-message">Aucun produit disponible pour le moment.</p>
          ) : (
            <>
              <div className="product-grid">
                {visibleProducts.map(product => (
                  <button
                    className="product-card"
                    key={product.id}
                    onClick={() => openProduct(product)}
                  >
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

              {totalPages > 1 && (
                <div className="pagination">
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    PRÉCÉDENT
                  </button>
                  <span>{page} / {totalPages}</span>
                  <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                    SUIVANT
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      ) : (
        <section className="detail-page">
          <button className="back-button" onClick={goBack}>
            ← BACK TO COLLECTION
          </button>

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
                  {(selectedProduct.sizes || []).map(item => (
                    <button
                      type="button"
                      key={item}
                      className={`option-button ${size === item ? 'active' : ''}`}
                      onClick={() => setSize(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <h3>SELECT COLOR</h3>
                <div className="option-list">
                  {(selectedProduct.colors || []).map(item => (
                    <button
                      type="button"
                      key={item}
                      className={`option-button ${color === item ? 'active' : ''}`}
                      onClick={() => setColor(item)}
                    >
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
              <label>
                Nom et prénom
                <input required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Votre nom complet" />
              </label>

              <label>
                Numéro de téléphone
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="05 XX XX XX XX" />
              </label>

              <label>
                Wilaya
                <select required value={wilaya} onChange={e => setWilaya(e.target.value)}>
                  <option value="">Choisir votre wilaya</option>
                  {wilayas.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label>
                Commune
                <input required value={city} onChange={e => setCity(e.target.value)} placeholder="Votre commune" />
              </label>

              <label className="full-field">
                Adresse (facultatif)
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Votre adresse" />
              </label>

              <div className="order-summary">
                <span>{selectedProduct.name}</span>
                <strong>{selectedProduct.price}</strong>
              </div>

              <button className="submit-order" type="submit">
                CONFIRMER SUR WHATSAPP ↗
              </button>
            </form>
          </section>

          <section className="related-section">
            <h2>YOU MAY ALSO LIKE</h2>
            <div className="related-grid">
              {products
                .filter(item => item.id !== selectedProduct.id)
                .slice(0, 3)
                .map(item => (
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
        <button
          className="admin-entry"
          onClick={() => {
            setSelectedProduct(null);
            setAdminOpen(true);
          }}
        >
          ADMIN
        </button>
        <span>© 2026 — ALL RIGHTS RESERVED</span>
      </footer>
    </main>
  );
}
