/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  X,
  Plus,
  Minus,
  Check,
  Globe,
  Truck,
  ShieldCheck,
  Eye,
  Trash2,
  PackageCheck,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';

// Product type definitions
interface Product {
  id: number;
  category: 'robes' | 'abayas' | 'ensembles' | 'accessoires';
  nameFr: string;
  nameAr: string;
  descFr: string;
  descAr: string;
  price: number;
  image: string;
  materialFr: string;
  materialAr: string;
  sizes: string[];
}

interface CartItem extends Product {
  selectedSize: string;
  qty: number;
}

// Product catalog matching user specifications with high-fidelity studio assets
const PRODUCTS: Product[] = [
  {
    id: 1,
    category: 'robes',
    nameFr: 'Robe Soie Crème Zizou',
    nameAr: 'فستان حرير كريمي زيزو',
    descFr: 'Robe longue en satin de soie ivoire fluide avec taille cintrée et manches bouffantes délicates.',
    descAr: 'فستان طويل من حرير الساتان العاجي الانسيابي مع خصر محدد وأكمام منفوخة راقية.',
    price: 9200,
    image: '/src/assets/images/zizou_robe_creme_1793282323353.jpg',
    materialFr: '100% Satin de soie naturelle, doublure douce',
    materialAr: '100% ساتان حرير طبيعي، بطانة ناعمة',
    sizes: ['36', '38', '40', '42']
  },
  {
    id: 2,
    category: 'abayas',
    nameFr: 'Abaya Minimaliste Sable',
    nameAr: 'عباية رملية كلاسيكية',
    descFr: 'Abaya coupe épurée en crêpe premium beige sable, tombé fluide pour une allure moderne.',
    descAr: 'عباية بقصة انسيابية أنيقة من الكريب الفاخر بلون بيج رملي لإطلالة راقية.',
    price: 11500,
    image: '/src/assets/images/zizou_abaya_sable_1793282324260.jpg',
    materialFr: 'Crêpe de Corée haut de gamme, toucher soyeux',
    materialAr: 'كريب كوري فاخر، ملمس حريري ناعم',
    sizes: ['52', '54', '56', '58']
  },
  {
    id: 3,
    category: 'ensembles',
    nameFr: 'Ensemble Lin Ivoire Zizou',
    nameAr: 'طقم كتان عاجي زيزو',
    descFr: 'Ensemble 2 pièces composé d’une blouse à col en V ceinturée et d’un pantalon palazzo en pur lin.',
    descAr: 'طقم مكون من قطعتين: قميص بياقة V وحزام خصر مع بنطال واسع مريح من الكتان الصافي.',
    price: 13800,
    image: '/src/assets/images/zizou_ensemble_lin_1793282325389.jpg',
    materialFr: '100% Lin lavé d’Europe, respirant et naturel',
    materialAr: '100% كتان طبيعي معالج، مريح وصيفي',
    sizes: ['38', '40', '42', '44']
  },
  {
    id: 4,
    category: 'accessoires',
    nameFr: 'Foulard Satin Délicat',
    nameAr: 'وشاح ساتان ناعم',
    descFr: 'Grand carré de satin chatoyant aux reflets champagne doré, bords roulottés à la main.',
    descAr: 'وشاح مربع كبير من الساتان الفاخر بلون الشمبانيا الذهبي وأطراف محاكة يدوياً.',
    price: 3400,
    image: '/src/assets/images/zizou_foulard_satin_1793282324785.jpg',
    materialFr: 'Satin de soie mélangée ultra-doux',
    materialAr: 'ساتان حرير ناعم خفيف الوزن',
    sizes: ['TU (90x90cm)']
  },
  {
    id: 5,
    category: 'robes',
    nameFr: 'Robe Plissée Beige Doré',
    nameAr: 'فستان بيج ذهبي مثني',
    descFr: 'Robe mi-longue à plissage accordéon permanent, teinte beige champagne et tombé impérial.',
    descAr: 'فستان ميدي بكسرات دائمة محكمة بلون بيج ذهبي متلألئ وقصة ملوكية.',
    price: 10400,
    image: '/src/assets/images/zizou_robe_plissee_1793282340236.jpg',
    materialFr: 'Mousseline lourde plissée à chaud',
    materialAr: 'شيفون سميك مكسر بحرارة عالية',
    sizes: ['36', '38', '40', '42']
  },
  {
    id: 6,
    category: 'ensembles',
    nameFr: 'Ensemble Tailleur Nude',
    nameAr: 'بدلة رسمية بلون محايد',
    descFr: 'Tailleur pantalon structuré avec veste cintrée à simple boutonnage et pantalon droit élancé.',
    descAr: 'بدلة رسمية كلاسيكية مع سترة ضيقة وأزرار أنيقة مع بنطال مستقيم القوام.',
    price: 15200,
    image: '/src/assets/images/zizou_tailleur_nude_1793282340236.jpg',
    materialFr: 'Laine froide et viscose premium, doublure satin',
    materialAr: 'صوف بارد وفيسكوز راقٍ مع بطانة ساتان',
    sizes: ['36', '38', '40', '42']
  }
];

// Bilingual translations dictionary
const I18N = {
  fr: {
    brandName: 'Zizou Boutique',
    brandWordmark: 'Zizou',
    brandWordmarkSub: 'Boutique',
    pageTitle: 'Zizou Boutique — Prêt-à-porter Élégant & Moderne',
    topBar: "Livraison offerte dès 8 000 DZD d'achats | Boutique Officielle Zizou Boutique",
    searchPlaceholder: 'Rechercher une création Zizou Boutique...',
    heroTag: 'Nouvelle Collection',
    heroTitle: 'L’Élégance Moderne Signée Zizou Boutique',
    heroDesc: 'Découvrez nos collections intemporelles de prêt-à-porter, conçues pour sublimer votre allure avec raffinement et confort.',
    exploreBtn: 'Explorer le Vestiaire',
    cartHeading: 'Votre Panier (Zizou Boutique)',
    subtotal: 'Sous-total :',
    checkout: 'Finaliser la commande',
    emptyCart: 'Votre panier est vide pour le moment.',
    addToCart: 'Ajouter au panier',
    quickView: 'Aperçu rapide',
    addedToast: 'Ajouté au panier !',
    freeShippingNotice: 'Plus que {remaining} DZD pour la livraison gratuite !',
    freeShippingAchieved: 'Félicitations ! Livraison offerte sur cette commande.',
    currency: 'DZD',
    size: 'Taille',
    quantity: 'Quantité',
    composition: 'Matière & Confection',
    deliveryTime: 'Livraison 24-48h à domicile partout en Algérie',
    codNotice: 'Paiement à la livraison (Cash on Delivery)',
    close: 'Fermer',
    footerDesc: "Maison de prêt-à-porter raffinée. Zizou Boutique allie l'authenticité des matières nobles aux coupes contemporaines pour une élégance discrète au quotidien.",
    fHome: 'Accueil',
    fCol: 'Collections',
    fAbout: 'À propos de Zizou Boutique',
    fShip: 'Livraison & Retours',
    fFaq: 'Guide des tailles',
    fTerms: 'Conditions Générales',
    fContact: 'Contact Zizou Boutique',
    fCopy: '© 2026 Zizou Boutique. Tous droits réservés. Démonstration officielle Zizou Boutique.',
    langToggle: 'العربية',
    categories: {
      all: 'Toutes les pièces',
      robes: 'Robes',
      abayas: 'Abayas',
      ensembles: 'Ensembles',
      accessoires: 'Accessoires'
    },
    checkoutModal: {
      title: 'Validation de commande Zizou Boutique',
      subtitle: 'Complétez vos coordonnées pour recevoir votre colis.',
      fullName: 'Nom & Prénom',
      phone: 'Numéro de téléphone',
      wilaya: 'Wilaya de livraison',
      address: 'Adresse de livraison détaillée',
      confirmBtn: 'Confirmer la commande (Paiement à la livraison)',
      orderTotal: 'Total de la commande :',
      freeShipLabel: 'Livraison :',
      free: 'Gratuite',
      standardShip: '600 DZD',
      successTitle: 'Commande Confirmée !',
      successMessage: 'Merci pour votre confiance en Zizou Boutique. Notre équipe prépare votre colis avec le plus grand soin.',
      orderNum: 'Numéro de commande :',
      continueShopping: 'Continuer le shopping'
    }
  },
  ar: {
    brandName: 'زيزو بوتيك',
    brandWordmark: 'زيزو',
    brandWordmarkSub: 'بوتيك',
    pageTitle: 'زيزو بوتيك — أزياء راقية وعصرية',
    topBar: 'توصيل مجاني للطلبات فوق 8000 د.ج | المتجر الرسمي لـ زيزو بوتيك',
    searchPlaceholder: 'ابحثي عن تشكيلات زيزو بوتيك...',
    heroTag: 'تشكيلة جديدة',
    heroTitle: 'أناقة عصرية بلمسة زيزو بوتيك',
    heroDesc: 'اكتشفي تشكيلاتنا الراقية من الملابس الجاهزة المصممة لتمنحك إطلالة متألقة تجمع بين الأصالة والراحة.',
    exploreBtn: 'استكشاف التشكيلة',
    cartHeading: 'سلة التسوق (زيزو بوتيك)',
    subtotal: 'المجموع الفرعي :',
    checkout: 'إتمام الطلب',
    emptyCart: 'سلتك فارغة حالياً.',
    addToCart: 'أضف إلى السلة',
    quickView: 'نظرة سريعة',
    addedToast: 'تمت الإضافة إلى السلة !',
    freeShippingNotice: 'تبقّى {remaining} د.ج فقط للحصول على توصيل مجاني !',
    freeShippingAchieved: 'تهانينا ! التوصيل مجاني لهذه الطلبية.',
    currency: 'د.ج',
    size: 'المقاس',
    quantity: 'الكمية',
    composition: 'الخامة والتفصيل',
    deliveryTime: 'توصيل سريع من 24 إلى 48 ساعة لكافة ولايات الجزائر',
    codNotice: 'الدفع عند الاستلام نقداً',
    close: 'إغلاق',
    footerDesc: 'دار أزياء راقية. تجمع زيزو بوتيك بين فخامة الأقمشة والقصات العصرية لأناقة استثنائية كل يوم.',
    fHome: 'الرئيسية',
    fCol: 'التشكيلات',
    fAbout: 'عن زيزو بوتيك',
    fShip: 'التوصيل والاسترجاع',
    fFaq: 'دليل المقاسات',
    fTerms: 'الشروط والأحكام',
    fContact: 'اتصل بـ زيزو بوتيك',
    fCopy: '© 2026 زيزو بوتيك. جميع الحقوق محفوظة. المتجر التجريبي لـ زيزو بوتيك.',
    langToggle: 'Français',
    categories: {
      all: 'جميع القطع',
      robes: 'فساتين',
      abayas: 'عبايات',
      ensembles: 'أطقم',
      accessoires: 'إكسسوارات'
    },
    checkoutModal: {
      title: 'تأكيد طلبية زيزو بوتيك',
      subtitle: 'يرجى إدخال معلوماتك لتوصيل طلبيتك إلى باب منزلك.',
      fullName: 'الاسم واللقب',
      phone: 'رقم الهاتف',
      wilaya: 'ولاية التوصيل',
      address: 'عنوان التوصيل بالتفصيل',
      confirmBtn: 'تأكيد الطلب (الدفع عند الاستلام)',
      orderTotal: 'المجموع الإجمالي :',
      freeShipLabel: 'التوصيل :',
      free: 'مجاني',
      standardShip: '600 د.ج',
      successTitle: 'تم تأكيد طلبك بنجاح !',
      successMessage: 'شكراً لثقتكم في زيزو بوتيك. سيتصل بكم فريقنا قريباً لتأكيد موعد التسليم.',
      orderNum: 'رقم الطلبية :',
      continueShopping: 'متابعة التسوق'
    }
  }
};

const ALGERIAN_WILAYAS = [
  '16 - Alger',
  '31 - Oran',
  '25 - Constantine',
  '06 - Béjaïa',
  '15 - Tizi Ouzou',
  '19 - Sétif',
  '09 - Blida',
  '35 - Boumerdès',
  '13 - Tlemcen',
  '23 - Annaba',
  '30 - Ouargla',
  '05 - Batna',
  'Autre Wilaya'
];

export default function App() {
  const [lang, setLang] = useState<'fr' | 'ar'>('fr');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewSize, setQuickViewSize] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerWilaya, setCustomerWilaya] = useState<string>(ALGERIAN_WILAYAS[0]);
  const [customerAddress, setCustomerAddress] = useState<string>('');

  const t = I18N[lang];
  const isRtl = lang === 'ar';

  // Synchronize document dir and title
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.title = t.pageTitle;
  }, [lang, isRtl, t.pageTitle]);

  // Set default quick view size when product selected
  useEffect(() => {
    if (quickViewProduct && quickViewProduct.sizes.length > 0) {
      setQuickViewSize(quickViewProduct.sizes[0]);
    }
  }, [quickViewProduct]);

  // Filtered catalog
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const name = lang === 'fr' ? p.nameFr.toLowerCase() : p.nameAr.toLowerCase();
      const desc = lang === 'fr' ? p.descFr.toLowerCase() : p.descAr.toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' || name.includes(query) || desc.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, lang]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.qty, 0);
  }, [cart]);

  const freeShippingThreshold = 8000;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = cartSubtotal === 0 ? 0 : isFreeShipping ? 0 : 600;
  const finalOrderTotal = cartSubtotal + shippingFee;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleAddToCart = (product: Product, size?: string) => {
    const chosenSize = size || product.sizes[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedSize === chosenSize
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          qty: next[existingIndex].qty + 1
        };
        return next;
      }
      return [...prev, { ...product, selectedSize: chosenSize, qty: 1 }];
    });
    showToast(t.addedToast);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (productId: number, size: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId && item.selectedSize === size) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: number, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)));
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      return;
    }
    const orderNum = `ZB-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderConfirmed(orderNum);
    setCart([]);
  };

  const resetOrderFlow = () => {
    setOrderConfirmed(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FBF9F5] text-[#24211E] ${isRtl ? 'font-arabic-luxury' : ''}`}>
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 left-1/2 -translate-x-1/2 bg-[#24211E] text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-all">
          <Check className="w-4 h-4 text-[#C9B8A4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <aside aria-label="Announcement" className="bg-[#F4EFE6] border-b border-[#E8DFD3] text-xs text-[#73695E] py-2 px-4 text-center tracking-wide font-medium">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#A67C52] shrink-0" />
          <span>{t.topBar}</span>
        </div>
      </aside>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8DFD3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#24211E] font-serif-luxury shrink-0"
          >
            <span>{t.brandWordmark}</span>
            <span className="text-[#A67C52] font-normal">{t.brandWordmarkSub}</span>
          </a>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-[#73695E] ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-white border border-[#E8DFD3] rounded-full py-2 text-sm text-[#24211E] placeholder:text-[#73695E]/60 focus:outline-none focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/10 transition-all ${
                isRtl ? 'pr-10 pl-8' : 'pl-10 pr-8'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-[#73695E] hover:text-[#24211E] ${isRtl ? 'left-3' : 'right-3'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right actions: Language switch & Cart button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8DFD3] bg-white text-xs font-semibold text-[#24211E] hover:border-[#A67C52] hover:text-[#A67C52] transition-colors"
              title="Changer de langue / تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-[#A67C52]" />
              <span>{t.langToggle}</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#E8DFD3] text-[#24211E] hover:bg-[#F4EFE6] transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="w-4 h-4 text-[#24211E]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#A67C52] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="sm:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-[#73695E] ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-white border border-[#E8DFD3] rounded-full py-2 text-sm text-[#24211E] placeholder:text-[#73695E]/60 focus:outline-none focus:border-[#A67C52] transition-all ${
                isRtl ? 'pr-10 pl-8' : 'pl-10 pr-8'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-[#73695E] hover:text-[#24211E] ${isRtl ? 'left-3' : 'right-3'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F4EFE6] to-[#FBF9F5] border-b border-[#E8DFD3] py-14 sm:py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-block text-xs uppercase tracking-[0.2em] font-semibold text-[#A67C52]">
            {t.heroTag}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#24211E] tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#73695E] leading-relaxed max-w-2xl mx-auto">
            {t.heroDesc}
          </p>

          <div className="pt-2 flex items-center justify-center gap-4">
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A67C52] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#8B653E] transition-all shadow-sm"
            >
              <span>{t.exploreBtn}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </div>

        {/* Quiet luxury brand guarantees */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-[#E8DFD3]/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#73695E]">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-[#A67C52]" />
            <span>{t.deliveryTime}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A67C52]" />
            <span>{t.codNotice}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#A67C52]" />
            <span>Service Client Réactif 7j/7</span>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main id="catalog" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12">
        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {(['all', 'robes', 'abayas', 'ensembles', 'accessoires'] as const).map((catKey) => {
            const isActive = selectedCategory === catKey;
            const label = t.categories[catKey];
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#A67C52] text-white shadow-xs'
                    : 'bg-white border border-[#E8DFD3] text-[#73695E] hover:border-[#A67C52] hover:text-[#24211E]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white border border-[#E8DFD3] rounded-2xl max-w-md mx-auto">
            <Search className="w-8 h-8 text-[#C9B8A4] mx-auto" />
            <p className="text-sm text-[#73695E]">
              {lang === 'fr'
                ? 'Aucune création trouvée correspondant à votre recherche.'
                : 'لم يتم العثور على أي قطعة تطابق عملية البحث.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#A67C52] hover:underline"
            >
              {lang === 'fr' ? 'Réinitialiser les filtres' : 'إعادة ضبط التصفية'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const title = lang === 'fr' ? product.nameFr : product.nameAr;
              const categoryLabel = t.categories[product.category];

              return (
                <div
                  key={product.id}
                  className="group bg-white border border-[#E8DFD3] rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  {/* Product Image Frame */}
                  <div className="relative aspect-[4/3] bg-[#F4EFE6] overflow-hidden">
                    <img
                      src={product.image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Quick View Button Overlay */}
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold tracking-wide backdrop-blur-xs"
                      aria-label="Aperçu rapide"
                    >
                      <span className="bg-[#24211E]/80 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.quickView}</span>
                      </span>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Quiet Category Metadata */}
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-[#A67C52] mb-1">
                        {categoryLabel}
                      </div>

                      <h3 className="font-serif-luxury text-lg font-bold text-[#24211E] tracking-tight">
                        {title}
                      </h3>

                      <div className="text-base font-bold text-[#24211E] font-mono tabular-nums mt-1">
                        {product.price.toLocaleString()} {t.currency}
                      </div>
                    </div>

                    {/* Available Sizes preview */}
                    <div className="pt-2 border-t border-[#E8DFD3]/60 flex items-center justify-between text-xs text-[#73695E]">
                      <span className="text-[11px] uppercase tracking-wider">{t.size} :</span>
                      <div className="flex items-center gap-1">
                        {product.sizes.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-[#F4EFE6] text-[11px] font-medium text-[#73695E]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Add to Cart CTA */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#F4EFE6] text-[#24211E] border border-[#E8DFD3] text-xs font-semibold hover:bg-[#A67C52] hover:border-[#A67C52] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            isRtl ? 'left-0' : 'right-0'
          } ${
            isCartOpen
              ? 'translate-x-0'
              : isRtl
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          {/* Cart Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8DFD3] flex items-center justify-between bg-[#FBF9F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#A67C52]" />
              <h2 className="font-serif-luxury text-lg font-bold text-[#24211E]">
                {t.cartHeading}
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-[#73695E] hover:text-[#24211E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="px-5 py-3 bg-[#F4EFE6] border-b border-[#E8DFD3] text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{t.freeShippingAchieved}</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#73695E]">
                  <span>
                    {t.freeShippingNotice.replace('{remaining}', (freeShippingThreshold - cartSubtotal).toLocaleString())}
                  </span>
                </div>
                <div className="w-full bg-[#E8DFD3] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#A67C52] h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-[#73695E]">
                <ShoppingBag className="w-12 h-12 text-[#C9B8A4]" />
                <p className="text-sm">{t.emptyCart}</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-xs font-semibold text-[#A67C52] hover:underline"
                >
                  {t.exploreBtn}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const title = lang === 'fr' ? item.nameFr : item.nameAr;
                return (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-3 pb-4 border-b border-[#E8DFD3]/80 items-center"
                  >
                    <img
                      src={item.image}
                      alt={title}
                      className="w-16 h-20 object-cover rounded-md bg-[#F4EFE6] shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif-luxury text-sm font-bold text-[#24211E] truncate">
                        {title}
                      </h4>
                      <div className="text-xs text-[#73695E] mt-0.5">
                        {t.size} : <span className="font-semibold text-[#24211E]">{item.selectedSize}</span>
                      </div>
                      <div className="text-xs font-mono font-semibold text-[#A67C52] mt-1 tabular-nums">
                        {item.price.toLocaleString()} {t.currency}
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-[#E8DFD3] rounded bg-white">
                          <button
                            onClick={() => handleUpdateQty(item.id, item.selectedSize, -1)}
                            className="p-1 text-[#73695E] hover:text-[#24211E]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono tabular-nums font-semibold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.id, item.selectedSize, 1)}
                            className="p-1 text-[#73695E] hover:text-[#24211E]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveFromCart(item.id, item.selectedSize)}
                          className="text-[#73695E] hover:text-red-700 p-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E8DFD3] bg-[#FBF9F5] space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#73695E]">{t.subtotal}</span>
                <span className="font-mono font-bold text-[#24211E] text-base tabular-nums">
                  {cartSubtotal.toLocaleString()} {t.currency}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 rounded-lg bg-[#A67C52] text-white text-sm font-semibold tracking-wide hover:bg-[#8B653E] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>{t.checkout}</span>
                <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E8DFD3] flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setQuickViewProduct(null)}
              className={`absolute top-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#24211E] shadow-xs ${
                isRtl ? 'left-3' : 'right-3'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="md:w-1/2 aspect-[4/3] md:aspect-auto bg-[#F4EFE6]">
              <img
                src={quickViewProduct.image}
                alt={lang === 'fr' ? quickViewProduct.nameFr : quickViewProduct.nameAr}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#A67C52]">
                  {t.categories[quickViewProduct.category]}
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#24211E] mt-1">
                  {lang === 'fr' ? quickViewProduct.nameFr : quickViewProduct.nameAr}
                </h3>
                <div className="text-xl font-bold font-mono text-[#24211E] tabular-nums mt-2">
                  {quickViewProduct.price.toLocaleString()} {t.currency}
                </div>

                <p className="text-sm text-[#73695E] leading-relaxed mt-4">
                  {lang === 'fr' ? quickViewProduct.descFr : quickViewProduct.descAr}
                </p>

                {/* Composition */}
                <div className="mt-4 pt-4 border-t border-[#E8DFD3] text-xs text-[#73695E] space-y-1">
                  <div className="font-semibold text-[#24211E]">{t.composition} :</div>
                  <div>{lang === 'fr' ? quickViewProduct.materialFr : quickViewProduct.materialAr}</div>
                </div>

                {/* Size Selection */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-xs font-semibold text-[#24211E]">{t.size} :</div>
                  <div className="flex gap-2 flex-wrap">
                    {quickViewProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuickViewSize(s)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                          quickViewSize === s
                            ? 'bg-[#A67C52] text-white border border-[#A67C52]'
                            : 'bg-white border border-[#E8DFD3] text-[#73695E] hover:border-[#A67C52]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  handleAddToCart(quickViewProduct, quickViewSize);
                  setQuickViewProduct(null);
                }}
                className="w-full py-3 rounded-lg bg-[#A67C52] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#8B653E] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Checkout Modal (Replaces standard window.alert) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E8DFD3] overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-[#E8DFD3] bg-[#FBF9F5] flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#24211E]">
                  {orderConfirmed ? t.checkoutModal.successTitle : t.checkoutModal.title}
                </h3>
                <p className="text-xs text-[#73695E]">
                  {orderConfirmed ? '' : t.checkoutModal.subtitle}
                </p>
              </div>
              <button
                onClick={resetOrderFlow}
                className="p-1 rounded-md text-[#73695E] hover:text-[#24211E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {orderConfirmed ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-[#F4EFE6] rounded-full flex items-center justify-center mx-auto text-[#A67C52]">
                    <PackageCheck className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif-luxury text-xl font-bold text-[#24211E]">
                    {t.checkoutModal.successTitle}
                  </h4>
                  <p className="text-sm text-[#73695E] max-w-sm mx-auto leading-relaxed">
                    {t.checkoutModal.successMessage}
                  </p>

                  <div className="bg-[#FBF9F5] border border-[#E8DFD3] rounded-xl p-4 max-w-xs mx-auto text-xs space-y-1">
                    <div className="text-[#73695E]">{t.checkoutModal.orderNum}</div>
                    <div className="font-mono font-bold text-sm text-[#A67C52]">{orderConfirmed}</div>
                    <div className="text-[11px] text-[#73695E] pt-1">{t.codNotice}</div>
                  </div>

                  <button
                    onClick={resetOrderFlow}
                    className="px-6 py-2.5 rounded-full bg-[#A67C52] text-white text-xs font-semibold hover:bg-[#8B653E] transition-all"
                  >
                    {t.checkoutModal.continueShopping}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#24211E] mb-1">
                      {t.checkoutModal.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Amina Benali"
                      className="w-full bg-[#FBF9F5] border border-[#E8DFD3] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#A67C52]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#24211E] mb-1">
                      {t.checkoutModal.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ex: 0550 12 34 56"
                      className="w-full bg-[#FBF9F5] border border-[#E8DFD3] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#A67C52]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#24211E] mb-1">
                      {t.checkoutModal.wilaya} *
                    </label>
                    <select
                      value={customerWilaya}
                      onChange={(e) => setCustomerWilaya(e.target.value)}
                      className="w-full bg-[#FBF9F5] border border-[#E8DFD3] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#A67C52]"
                    >
                      {ALGERIAN_WILAYAS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#24211E] mb-1">
                      {t.checkoutModal.address} *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Quartier, N° rue, bâtiment..."
                      className="w-full bg-[#FBF9F5] border border-[#E8DFD3] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#A67C52]"
                    />
                  </div>

                  {/* Order Financial Summary */}
                  <div className="bg-[#FBF9F5] border border-[#E8DFD3] rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between text-[#73695E]">
                      <span>{t.subtotal}</span>
                      <span className="font-mono tabular-nums">{cartSubtotal.toLocaleString()} {t.currency}</span>
                    </div>
                    <div className="flex justify-between text-[#73695E]">
                      <span>{t.checkoutModal.freeShipLabel}</span>
                      <span className="font-mono tabular-nums">
                        {isFreeShipping ? (
                          <span className="text-emerald-700 font-semibold">{t.checkoutModal.free}</span>
                        ) : (
                          t.checkoutModal.standardShip
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#E8DFD3] flex justify-between font-bold text-sm text-[#24211E]">
                      <span>{t.checkoutModal.orderTotal}</span>
                      <span className="font-mono tabular-nums">{finalOrderTotal.toLocaleString()} {t.currency}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#A67C52] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#8B653E] transition-all cursor-pointer shadow-sm"
                  >
                    {t.checkoutModal.confirmBtn}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#F4EFE6] border-t border-[#E8DFD3] mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand column */}
            <div className="space-y-3">
              <h3 className="font-serif-luxury text-xl font-bold text-[#24211E]">
                {t.brandName}
              </h3>
              <p className="text-xs text-[#73695E] leading-relaxed">
                {t.footerDesc}
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#24211E]">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-[#73695E]">
                <li><a href="#" className="hover:text-[#A67C52] transition-colors">{t.fHome}</a></li>
                <li><a href="#catalog" className="hover:text-[#A67C52] transition-colors">{t.fCol}</a></li>
                <li><a href="#" className="hover:text-[#A67C52] transition-colors">{t.fAbout}</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#24211E]">
                Service Client
              </h4>
              <ul className="space-y-2 text-xs text-[#73695E]">
                <li><span className="hover:text-[#A67C52] cursor-pointer">{t.fShip}</span></li>
                <li><span className="hover:text-[#A67C52] cursor-pointer">{t.fFaq}</span></li>
                <li><span className="hover:text-[#A67C52] cursor-pointer">{t.fTerms}</span></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#24211E]">
                {t.fContact}
              </h4>
              <ul className="space-y-2 text-xs text-[#73695E]">
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#A67C52] shrink-0" />
                  <span>contact@zizouboutique.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#A67C52] shrink-0" />
                  <span>+213 (0) 550 12 34 56</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#A67C52] shrink-0" />
                  <span>Alger, Algérie</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E8DFD3] text-center text-xs text-[#73695E]">
            {t.fCopy}
          </div>
        </div>
      </footer>
    </div>
  );
}
