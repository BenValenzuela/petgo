"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";

const customers = [
  { name: "Camila R.", dog: "Milo", breed: "Labrador", product: "Adulto · 15 kg", week: 3, days: 28, status: "Pendiente", tone: "gold", emoji: "🐕" },
  { name: "Jorge M.", dog: "Rocky", breed: "Pastor alemán", product: "Adulto · 15 kg", week: 2, days: 28, status: "Próximo", tone: "blue", emoji: "🐕‍🦺" },
  { name: "Valentina S.", dog: "Luna", breed: "Poodle", product: "Adulto · 8 kg", week: 4, days: 28, status: "Contactado", tone: "green", emoji: "🐩" },
  { name: "Diego P.", dog: "Max", breed: "Beagle", product: "Adulto · 15 kg", week: 1, days: 28, status: "Próximo", tone: "blue", emoji: "🐶" },
];

function Paw() { return <span className="panel-paw">●<i>● ●</i></span>; }

export default function Panel() {
  const [filter, setFilter] = useState("Todos");
  const [contacted, setContacted] = useState<string[]>([]);
  const visible = customers.filter((customer) => filter === "Todos" || customer.status === filter || (filter === "Contactado" && contacted.includes(customer.name)));

  const contact = (name: string, dog: string) => {
    setContacted((current) => [...current, name]);
    const text = encodeURIComponent(`¡Hola! Somos Petgo 🐾 Queríamos saber cómo va ${dog} con su alimento y si necesitarán una reposición pronto.`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return <main className="panel-shell">
    <aside className="panel-sidebar">
      <Link href="/" className="panel-logo"><Paw/><strong>petgo</strong><small>Panel del negocio</small></Link>
      <nav>
        <a className="active" href="#inicio"><span>⌂</span> Inicio</a>
        <a href="#pedidos"><span>▣</span> Pedidos</a>
        <a href="#clientes"><span>♙</span> Clientes</a>
        <a href="#seguimiento"><span>◎</span> Seguimiento</a>
        <a href="#productos"><span>▤</span> Productos</a>
        <a href="#reportes"><span>⌁</span> Reportes</a>
      </nav>
      <div className="sidebar-bottom"><span>♥</span><p>Más perros felices<br/>todos los días.</p></div>
    </aside>

    <section className="panel-main">
      <header className="panel-topbar"><div className="mobile-panel-brand"><Paw/><b>petgo</b></div><div className="panel-user"><span>Demo</span><b>P</b><div><strong>Petgo Store</strong><small>Administrador</small></div></div></header>
      <div className="panel-content">
        <div className="panel-title"><div><span className="demo-pill">Vista demostrativa</span><h1>Panel de seguimiento</h1><p>Revisa el estado de tus clientes y no olvides hacer seguimiento.</p></div><Link href="/">← Volver a la tienda</Link></div>

        <div className="metrics">
          {[{ icon: "👥", label: "Clientes activos", value: "24", change: "+20%", tone: "mint" }, { icon: "📦", label: "Pedidos entregados", value: "18", change: "+13%", tone: "lime" }, { icon: "↻", label: "Pendientes de seguimiento", value: "6", change: "esta semana", tone: "coral" }].map((metric, index) => <motion.article key={metric.label} className={`metric ${metric.tone}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }}><span>{metric.icon}</span><div><small>{metric.label}</small><strong>{metric.value}</strong><em>{metric.change}</em></div></motion.article>)}
        </div>

        <motion.div className="alert-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }}><span>🔔</span><div><strong>Es momento de consultar cómo va el alimento de Milo.</strong><p>Camila R. está en la semana 3 de 4. Recuérdale que puede pedir su reposición.</p></div><button>×</button></motion.div>

        <section className="customer-section" id="seguimiento">
          <div className="customer-heading"><div><h2>Clientes por contactar</h2><span>6 seguimientos esta semana</span></div><div className="filters">{["Todos", "Pendiente", "Contactado"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
          <div className="customer-list">{visible.map((customer, index) => {
            const isContacted = customer.status === "Contactado" || contacted.includes(customer.name);
            return <motion.article className="customer-row" key={customer.name} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}>
              <div className={`dog-avatar ${customer.tone}`}>{customer.emoji}</div>
              <div className="customer-person"><strong>{customer.name}</strong><span><b>{customer.dog}</b> · {customer.breed}</span><small>{customer.product}</small></div>
              <div className="week-progress"><div><strong>Semana {customer.week} de 4</strong><small>Duración estimada: {customer.days} días</small></div><div className="week-bars">{[1,2,3,4].map((week) => <i className={week <= customer.week ? "filled" : ""} key={week}/>)}</div></div>
              <span className={`status ${isContacted ? "contacted" : customer.status.toLowerCase()}`}>{isContacted ? "Contactado" : customer.status}</span>
              <button className={isContacted ? "contact-button done" : "contact-button"} disabled={isContacted} onClick={() => contact(customer.name, customer.dog)}>{isContacted ? "✓ Contactado" : "Contactar por WhatsApp"}</button>
            </motion.article>;
          })}</div>
        </section>
      </div>
    </section>
  </main>;
}
