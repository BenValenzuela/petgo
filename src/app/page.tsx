"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";

type Product = {
  id: number; name: string; detail: string; stage: string; price: number;
  sizes: string[]; color: string; accent: string;
};
type CartItem = Product & { quantity: number; size: string };

const products: Product[] = [
  { id: 1, name: "Adulto razas medianas", detail: "Nutrición completa para una vida activa.", stage: "Adulto", price: 24990, sizes: ["3 kg", "8 kg", "15 kg"], color: "#d7b98c", accent: "#174d3c" },
  { id: 2, name: "Cachorro crecimiento", detail: "Proteínas y nutrientes para sus primeros pasos.", stage: "Cachorro", price: 22990, sizes: ["3 kg", "8 kg"], color: "#e9a59a", accent: "#b95149" },
  { id: 3, name: "Adulto razas grandes", detail: "Energía y vitalidad para grandes aventuras.", stage: "Adulto", price: 32990, sizes: ["8 kg", "15 kg"], color: "#9caec0", accent: "#2d4a68" },
];

const formatPrice = (value: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    cart: <><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/></>,
    truck: <><path d="M10 17h4V5H2v12h3"/><path d="M14 9h4l4 4v4h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></>,
    leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5.2 18 2 18 2c1.2 7.4-2.7 13.5-7 14"/><path d="M2 21c0-3 1.85-5.36 5.08-6.94C9.36 12.94 12 12 16 12"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    minus: <path d="M5 12h14"/>, plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    whatsapp: <><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.7-5a8.6 8.6 0 1 1 16.3-4.5Z"/><path d="M8.2 8.1c.3 3 2.7 5.2 5.6 5.8l1.4-1.1"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    menu: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function PawMark() {
  return <span className="paw-mark" aria-hidden="true"><i/><i/><i/><i/><b/></span>;
}

function ProductBag({ product }: { product: Product }) {
  return <div className="product-visual"><motion.div whileHover={{ y: -6, rotate: -1 }} className="bag" style={{ backgroundColor: product.color }}><div className="bag-seal"/><div className="bag-brand"><PawMark/> petgo</div><div className="bag-shape" style={{ backgroundColor: product.accent }}/><div className="bag-label"><strong>{product.stage}</strong><span>alimento completo</span></div></motion.div><div className="food-bowl"><span>● ● ●</span></div></div>;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>(Object.fromEntries(products.map((product) => [product.id, product.sizes.at(-1) ?? ""])));
  const [toast, setToast] = useState("");

  useEffect(() => { const saved = window.localStorage.getItem("petgo-demo-cart"); if (saved) setCart(JSON.parse(saved)); }, []);
  useEffect(() => { window.localStorage.setItem("petgo-demo-cart", JSON.stringify(cart)); }, [cart]);

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product: Product) => {
    const size = selectedSizes[product.id];
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id && item.size === size);
      if (existing) return current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, size, quantity: 1 }];
    });
    setToast(`${product.name} agregado al carrito`);
    window.setTimeout(() => setToast(""), 2400);
  };

  const changeQuantity = (index: number, amount: number) => setCart((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));

  const sendOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lines = cart.map((item) => `• ${item.quantity}× ${item.name} (${item.size}) — ${formatPrice(item.price * item.quantity)}`);
    const message = ["¡Hola Petgo! 🐾 Quiero realizar este pedido:", "", ...lines, "", `Total: ${formatPrice(total)}`, `Nombre: ${form.get("name")}`, `Teléfono: ${form.get("phone")}`, `Dirección: ${form.get("address")}`, "", "Quedo atento/a a los datos de transferencia y la confirmación del despacho."].join("\n");
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return <main>
    <header className="site-header">
      <Link href="#inicio" className="brand" aria-label="Petgo, inicio"><PawMark/><span>petg<span className="brand-o">o</span></span></Link>
      <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navegación principal"><a href="#alimentos" onClick={() => setMenuOpen(false)}>Alimentos</a><a href="#como-funciona" onClick={() => setMenuOpen(false)}>Cómo funciona</a><a href="#seguimiento" onClick={() => setMenuOpen(false)}>Seguimiento</a><Link href="/panel">Panel demo</Link></nav>
      <div className="header-actions"><button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito con ${count} productos`}><Icon name="cart" size={23}/><span>Carrito</span>{count > 0 && <b>{count}</b>}</button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Icon name={menuOpen ? "close" : "menu"}/></button></div>
    </header>

    <section id="inicio" className="hero"><Image src="/petgo-hero.png" alt="Golden retriever junto a su alimento" fill priority sizes="100vw" className="hero-image"/><div className="hero-overlay"/><motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}><span className="eyebrow"><span className="pulse-dot"/> Delivery de alimento para perros</span><h1>Su comida favorita,<br/><em>directo a tu puerta.</em></h1><p>Alimentos seleccionados para cada etapa, con despacho a domicilio y seguimiento antes de que se acabe.</p><div className="hero-buttons"><a className="primary-button" href="#alimentos">Ver alimentos <Icon name="arrow"/></a><a className="text-button" href="#como-funciona">Conoce cómo funciona</a></div><div className="hero-proof"><span>✓ Compra simple</span><span>✓ Pedido por WhatsApp</span><span>✓ Seguimiento personalizado</span></div></motion.div></section>

    <section className="benefit-strip" aria-label="Beneficios">{[["truck", "Recíbelo en tu hogar", "Coordinamos tu despacho"], ["leaf", "Alimento para cada etapa", "Opciones según sus necesidades"], ["heart", "Nunca te quedes sin comida", "Te avisamos antes de que se acabe"]].map(([icon, title, detail]) => <div className="benefit" key={title}><span className="benefit-icon"><Icon name={icon} size={26}/></span><div><strong>{title}</strong><small>{detail}</small></div></div>)}</section>

    <section id="alimentos" className="section products-section"><div className="section-heading"><div><span className="eyebrow coral">Selección Petgo</span><h2>Alimentos destacados</h2><p>Una muestra inicial del catálogo. Productos, marcas y precios son demostrativos.</p></div><span className="demo-pill">Catálogo demo</span></div><div className="product-grid">{products.map((product, index) => <motion.article className="product-card" key={product.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .08 }}><ProductBag product={product}/><div className="product-content"><span className="stage-label">{product.stage}</span><h3>{product.name}</h3><p>{product.detail}</p><div className="size-picker" aria-label="Seleccionar tamaño">{product.sizes.map((size) => <button key={size} className={selectedSizes[product.id] === size ? "active" : ""} onClick={() => setSelectedSizes((current) => ({ ...current, [product.id]: size }))}>{size}</button>)}</div><div className="product-footer"><strong>{formatPrice(product.price)}</strong><button onClick={() => addToCart(product)}><Icon name="cart"/> Agregar</button></div></div></motion.article>)}</div></section>

    <section id="como-funciona" className="section how-section"><div className="how-copy"><span className="eyebrow light">Comprar es fácil</span><h2>Del carrito a su plato,<br/>sin complicaciones.</h2><p>El cliente elige sus productos, completa sus datos y confirma el pedido directamente por WhatsApp.</p><a className="secondary-button" href="#alimentos">Armar mi pedido <Icon name="arrow"/></a></div><div className="steps">{[["01", "Elige su alimento", "Agrega los productos y formatos que necesita."], ["02", "Completa la entrega", "Indica nombre, teléfono y dirección de despacho."], ["03", "Confirma por WhatsApp", "Recibe los datos de transferencia y coordina la entrega."]].map(([number, title, detail]) => <motion.div className="step" key={number} whileHover={{ x: 7 }}><span>{number}</span><div><h3>{title}</h3><p>{detail}</p></div></motion.div>)}</div></section>

    <section id="seguimiento" className="section followup-section"><motion.div className="followup-card" initial={{ opacity: 0, scale: .97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}><div className="mini-notification"><span><Icon name="bell"/></span><div><small>Seguimiento inteligente</small><strong>Es momento de consultar cómo va el alimento de Milo.</strong><p>Camila está en la semana 3 de 4.</p></div></div><div className="progress-demo"><span className="done"/><span className="done"/><span className="done"/><span/></div></motion.div><div className="followup-copy"><span className="eyebrow coral">Una compra que continúa</span><h2>Petgo recuerda cuándo volver a conversar.</h2><p>Después de cada entrega, el equipo puede ver qué clientes se acercan al final de su alimento y contactarlos en el momento justo.</p><ul><li><Icon name="check"/> Avisos según la duración estimada</li><li><Icon name="check"/> Historial de pedidos y clientes</li><li><Icon name="check"/> Mensaje de WhatsApp preparado</li></ul><Link className="panel-link" href="/panel">Explorar panel de seguimiento <Icon name="arrow"/></Link></div></section>

    <section className="closing-cta"><PawMark/><span>Que nunca falte comida en su plato.</span><a href="#alimentos">Elegir su alimento <Icon name="arrow"/></a></section>
    <footer><Link href="#inicio" className="brand footer-brand"><PawMark/><span>petgo</span></Link><p>Comida que llega a tiempo. Siempre.</p><div><a href="#alimentos">Alimentos</a><a href="#como-funciona">Cómo funciona</a><Link href="/panel">Panel demo</Link></div><small>Propuesta demostrativa · Petgo 2026</small></footer>

    <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><span><Icon name="check"/></span>{toast}</motion.div>}</AnimatePresence>
    <AnimatePresence>{cartOpen && <><motion.button className="drawer-backdrop" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}/><motion.aside className="cart-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}><div className="drawer-header"><div><span>Tu pedido</span><small>{count} {count === 1 ? "producto" : "productos"}</small></div><button onClick={() => setCartOpen(false)} aria-label="Cerrar"><Icon name="close"/></button></div>{cart.length === 0 ? <div className="empty-cart"><span><Icon name="cart" size={32}/></span><h3>Tu carrito está vacío</h3><p>Agrega un alimento para preparar el pedido.</p><button onClick={() => setCartOpen(false)}>Ver alimentos</button></div> : <form onSubmit={sendOrder} className="checkout-form"><div className="cart-items">{cart.map((item, index) => <div className="cart-item" key={`${item.id}-${item.size}`}><div className="cart-thumb" style={{ background: item.color }}><PawMark/></div><div><strong>{item.name}</strong><small>{item.size}</small><div className="quantity"><button type="button" onClick={() => changeQuantity(index, -1)}><Icon name="minus" size={15}/></button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(index, 1)}><Icon name="plus" size={15}/></button></div></div><b>{formatPrice(item.price * item.quantity)}</b></div>)}</div><div className="checkout-total"><span>Subtotal</span><strong>{formatPrice(total)}</strong><span>Despacho</span><strong>A coordinar</strong><b>Total productos</b><b>{formatPrice(total)}</b></div><div className="customer-fields"><h3>Datos de entrega</h3><label>Nombre<input name="name" required placeholder="Tu nombre"/></label><label>Teléfono<input name="phone" required inputMode="tel" placeholder="+56 9 1234 5678"/></label><label>Dirección<input name="address" required placeholder="Calle, número y comuna"/></label></div><button className="whatsapp-button" type="submit"><Icon name="whatsapp"/> Enviar pedido por WhatsApp <Icon name="arrow"/></button><p className="checkout-note">Demo: se abrirá WhatsApp con el pedido listo. No se realizará ningún cobro.</p></form>}</motion.aside></>}</AnimatePresence>
  </main>;
}
