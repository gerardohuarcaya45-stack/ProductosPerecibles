import { FormEvent, ReactNode, useMemo, useState } from "react";

type Page = "login" | "dashboard" | "products" | "productForm" | "detail" | "movements" | "expirations" | "users";
type ProductStatus = "Disponible" | "Próximo a vencer" | "Vencido";
type Product = {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  entry: string;
  expiry: string;
  status: ProductStatus;
};
type Movement = { id: number; product: string; type: "Entrada" | "Salida"; quantity: number; date: string; user: string };

const initialProducts: Product[] = [
  { id: 1, code: "PRD-001", name: "Leche entera", category: "Lácteos", quantity: 24, entry: "2025-05-20", expiry: "2025-06-12", status: "Próximo a vencer" },
  { id: 2, code: "PRD-002", name: "Yogur natural", category: "Lácteos", quantity: 18, entry: "2025-05-18", expiry: "2025-06-04", status: "Vencido" },
  { id: 3, code: "PRD-003", name: "Manzana roja", category: "Frutas", quantity: 42, entry: "2025-06-02", expiry: "2025-06-20", status: "Disponible" },
  { id: 4, code: "PRD-004", name: "Pechuga de pollo", category: "Carnes", quantity: 15, entry: "2025-06-03", expiry: "2025-06-09", status: "Próximo a vencer" },
  { id: 5, code: "PRD-005", name: "Pan integral", category: "Panadería", quantity: 30, entry: "2025-06-01", expiry: "2025-06-08", status: "Próximo a vencer" },
  { id: 6, code: "PRD-006", name: "Zanahoria", category: "Verduras", quantity: 36, entry: "2025-06-03", expiry: "2025-06-24", status: "Disponible" },
  { id: 7, code: "PRD-007", name: "Queso fresco", category: "Lácteos", quantity: 12, entry: "2025-05-16", expiry: "2025-06-01", status: "Vencido" },
  { id: 8, code: "PRD-008", name: "Jugo de naranja", category: "Bebidas", quantity: 28, entry: "2025-06-04", expiry: "2025-07-04", status: "Disponible" },
];

const initialMovements: Movement[] = [
  { id: 1, product: "Manzana roja", type: "Entrada", quantity: 20, date: "05 jun 2025, 09:42", user: "Ana Torres" },
  { id: 2, product: "Leche entera", type: "Salida", quantity: 6, date: "05 jun 2025, 08:15", user: "Carlos Ruiz" },
  { id: 3, product: "Pechuga de pollo", type: "Entrada", quantity: 15, date: "04 jun 2025, 16:30", user: "Ana Torres" },
  { id: 4, product: "Pan integral", type: "Salida", quantity: 10, date: "04 jun 2025, 14:18", user: "María López" },
  { id: 5, product: "Jugo de naranja", type: "Entrada", quantity: 28, date: "04 jun 2025, 11:05", user: "Carlos Ruiz" },
];

const usersSeed = [
  { id: 1, code: "USR-001", name: "Ana Torres", email: "ana.torres@institucion.edu", role: "Administrador", active: true },
  { id: 2, code: "USR-002", name: "Carlos Ruiz", email: "carlos.ruiz@institucion.edu", role: "Usuario", active: true },
  { id: 3, code: "USR-003", name: "María López", email: "maria.lopez@institucion.edu", role: "Usuario", active: true },
  { id: 4, code: "USR-004", name: "José Medina", email: "jose.medina@institucion.edu", role: "Usuario", active: false },
];

function Icon({ name, size = 19 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" /><path d="M12 11v10" /></>,
    arrows: <><path d="M7 7h11l-3-3" /><path d="m18 7-3 3" /><path d="M17 17H6l3 3" /><path d="m6 17 3-3" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    back: <><path d="m15 18-6-6 6-6" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    package: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
    down: <path d="m6 9 6 6 6-6" />,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const pageMeta: Record<Page, [string, string]> = {
  login: ["Iniciar sesión", ""],
  dashboard: ["Dashboard", "Resumen general del inventario"],
  products: ["Gestión de productos", "Consulta y administra los productos registrados"],
  productForm: ["Registrar producto", "Completa la información del producto"],
  detail: ["Detalle del producto", "Información completa e historial de movimientos"],
  movements: ["Movimientos de inventario", "Registra y consulta entradas y salidas"],
  expirations: ["Control de vencimientos", "Productos que requieren atención"],
  users: ["Gestión de usuarios", "Administra los accesos al sistema"],
};

function Status({ value }: { value: ProductStatus }) {
  const cls = value === "Disponible" ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15" : value === "Próximo a vencer" ? "bg-amber-50 text-amber-700 ring-amber-600/15" : "bg-rose-50 text-rose-700 ring-rose-600/15";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{value}</span>;
}

function Button({ children, onClick, variant = "primary", type = "button" }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "danger"; type?: "button" | "submit" }) {
  const styles = variant === "primary" ? "bg-[#176b57] text-white hover:bg-[#125747] shadow-sm" : variant === "danger" ? "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
  return <button type={type} onClick={onClick} className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${styles}`}>{children}</button>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>{children}</label>;
}

const inputClass = "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#24866e] focus:ring-3 focus:ring-emerald-100";

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [users, setUsers] = useState(usersSeed);
  const [selected, setSelected] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loginError, setLoginError] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navigate = (next: Page) => {
    setPage(next);
    setMobileMenu(false);
    window.scrollTo(0, 0);
  };

  if (page === "login") {
    return <Login onLogin={(user, pass) => {
      if (!user.trim() || !pass.trim()) setLoginError(true);
      else { setLoginError(false); navigate("dashboard"); }
    }} error={loginError} />;
  }

  const nav = [
    ["dashboard", "grid", "Dashboard"],
    ["products", "box", "Productos"],
    ["movements", "arrows", "Movimientos"],
    ["expirations", "clock", "Vencimientos"],
    ["users", "users", "Usuarios"],
  ] as const;

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-slate-800">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#123a32] text-white shadow-xl transition-transform lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#d4f2e5] text-[#176b57]"><Icon name="package" size={23} /></div>
          <div><p className="text-[17px] font-bold tracking-tight">PereciControl</p><p className="text-[11px] text-emerald-100/60">Gestión de inventario</p></div>
        </div>
        <nav className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-emerald-100/40">Menú principal</p>
          <div className="space-y-1">
            {nav.map(([key, icon, label]) => {
              const active = page === key || (key === "products" && (page === "productForm" || page === "detail"));
              return <button key={key} onClick={() => navigate(key)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${active ? "bg-white/12 text-white shadow-inner" : "text-emerald-50/70 hover:bg-white/7 hover:text-white"}`}><Icon name={icon} /><span>{label}</span>{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#75d9b6]" />}</button>;
            })}
          </div>
        </nav>
        <div className="border-t border-white/10 p-3">
          <button onClick={() => navigate("login")} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-emerald-50/70 transition hover:bg-white/7 hover:text-white"><Icon name="logout" />Cerrar sesión</button>
        </div>
      </aside>
      {mobileMenu && <button aria-label="Cerrar menú" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setMobileMenu(false)} />}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur md:px-8">
          <button className="mr-3 text-slate-600 lg:hidden" onClick={() => setMobileMenu(true)} aria-label="Abrir menú"><Icon name="menu" size={23} /></button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">{pageMeta[page][0]}</h1>
            <p className="hidden text-xs text-slate-500 sm:block">{pageMeta[page][1]}</p>
          </div>
          <button aria-label="Notificaciones" className="relative mr-4 grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100"><Icon name="bell" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" /></button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e5f4ef] text-sm font-bold text-[#176b57]">AT</div>
            <div className="hidden sm:block"><p className="text-sm font-semibold text-slate-800">Ana Torres</p><p className="text-xs text-slate-500">Administrador</p></div>
            <Icon name="down" size={15} />
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-5 md:p-8">
          {page === "dashboard" && <Dashboard products={products} movements={movements} navigate={navigate} />}
          {page === "products" && <Products products={products} onAdd={() => { setEditing(null); navigate("productForm"); }} onView={(p) => { setSelected(p); navigate("detail"); }} onEdit={(p) => { setEditing(p); navigate("productForm"); }} onDelete={(id) => setProducts(products.filter((p) => p.id !== id))} />}
          {page === "productForm" && <ProductForm product={editing} onCancel={() => navigate("products")} onSave={(data) => {
            if (editing) setProducts(products.map((p) => p.id === editing.id ? { ...data, id: p.id } : p));
            else setProducts([...products, { ...data, id: Date.now() }]);
            navigate("products");
          }} />}
          {page === "detail" && <ProductDetail product={selected ?? products[0]} movements={movements} onBack={() => navigate("products")} onEdit={(p) => { setEditing(p); navigate("productForm"); }} />}
          {page === "movements" && <Movements movements={movements} products={products} onAdd={(movement) => setMovements([{ ...movement, id: Date.now() }, ...movements])} />}
          {page === "expirations" && <Expirations products={products} onView={(p) => { setSelected(p); navigate("detail"); }} />}
          {page === "users" && <Users users={users} setUsers={setUsers} />}
        </main>
      </div>
    </div>
  );
}

function Login({ onLogin, error }: { onLogin: (user: string, password: string) => void; error: boolean }) {
  const [user, setUser] = useState("admin@institucion.edu");
  const [password, setPassword] = useState("123456");
  return (
    <div className="grid min-h-screen bg-[#f3f7f5] lg:grid-cols-[1.08fr_.92fr]">
      <section className="relative hidden overflow-hidden bg-[#123a32] p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border-[70px] border-white/[.025]" />
        <div className="absolute -bottom-40 left-20 h-[430px] w-[430px] rounded-full border-[80px] border-emerald-300/[.04]" />
        <div className="relative flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#d4f2e5] text-[#176b57]"><Icon name="package" size={25} /></div><div><p className="text-xl font-bold">PereciControl</p><p className="text-xs text-emerald-100/60">Gestión de inventario</p></div></div>
        <div className="relative max-w-xl">
          <span className="mb-7 inline-flex rounded-full border border-emerald-200/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-emerald-100/80">CONTROL SIMPLE · DECISIONES OPORTUNAS</span>
          <h1 className="text-5xl font-bold leading-[1.08] tracking-[-.04em]">Cuida cada producto,<br /><span className="text-[#83ddbd]">aprovecha cada recurso.</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-emerald-50/65">Controla existencias, movimientos y fechas de vencimiento desde un solo lugar.</p>
        </div>
        <p className="relative text-xs text-emerald-100/35">Sistema académico de gestión de productos perecibles</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-9 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#176b57] text-white"><Icon name="package" /></div><span className="text-lg font-bold text-[#123a32]">PereciControl</span></div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-[#24866e]">Bienvenido</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inicia sesión en tu cuenta</h2>
          <p className="mt-3 text-sm text-slate-500">Ingresa tus credenciales para acceder al sistema.</p>
          <form className="mt-9 space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(user, password); }}>
            {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">Completa tu correo y contraseña para continuar.</div>}
            <Field label="Usuario o correo electrónico"><input className={inputClass} value={user} onChange={(e) => setUser(e.target.value)} placeholder="usuario@institucion.edu" /></Field>
            <Field label="Contraseña"><input className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Ingresa tu contraseña" /></Field>
            <button className="mt-2 h-12 w-full rounded-lg bg-[#176b57] text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#125747]">Iniciar sesión</button>
          </form>
          <p className="mt-8 text-center text-xs text-slate-400">Acceso exclusivo para personal autorizado</p>
        </div>
      </section>
    </div>
  );
}

function Dashboard({ products, movements, navigate }: { products: Product[]; movements: Movement[]; navigate: (p: Page) => void }) {
  const cards = [
    ["Total de productos", products.length, "package", "bg-sky-50 text-sky-700", "Todos los registros"],
    ["Productos disponibles", products.filter((p) => p.status === "Disponible").length, "box", "bg-emerald-50 text-emerald-700", "Inventario saludable"],
    ["Próximos a vencer", products.filter((p) => p.status === "Próximo a vencer").length, "clock", "bg-amber-50 text-amber-700", "Requieren atención"],
    ["Productos vencidos", products.filter((p) => p.status === "Vencido").length, "calendar", "bg-rose-50 text-rose-700", "Acción inmediata"],
  ];
  const categories = ["Lácteos", "Frutas", "Carnes", "Panadería", "Verduras", "Bebidas"].map((c) => ({ name: c, value: products.filter((p) => p.category === c).length }));
  const max = Math.max(...categories.map((c) => c.value), 1);
  return <div className="space-y-7">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm text-slate-500">Jueves, 5 de junio de 2025</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Buenos días, Ana</h2></div><Button onClick={() => navigate("productForm")}><Icon name="plus" size={17} />Registrar producto</Button></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, number, icon, color, note]) => <div key={String(label)} className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,.035)]">
        <div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}><Icon name={String(icon)} size={21} /></div><span className="text-xs text-slate-400">Este mes</span></div>
        <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{number}</p><p className="mt-1 text-sm font-semibold text-slate-700">{label}</p><p className="mt-2 text-xs text-slate-400">{note}</p>
      </div>)}
    </section>
    <section className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,.035)]">
        <div><h3 className="font-bold text-slate-900">Productos por categoría</h3><p className="mt-1 text-xs text-slate-500">Distribución actual del inventario</p></div>
        <div className="mt-7 space-y-5">{categories.map((c) => <div key={c.name}><div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-slate-600">{c.name}</span><span className="text-slate-400">{c.value} productos</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#43a88a]" style={{ width: `${Math.max((c.value / max) * 100, 8)}%` }} /></div></div>)}</div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,.035)]">
        <div className="flex items-center justify-between p-6"><div><h3 className="font-bold text-slate-900">Últimos movimientos</h3><p className="mt-1 text-xs text-slate-500">Actividad reciente del inventario</p></div><button onClick={() => navigate("movements")} className="flex items-center gap-1 text-xs font-bold text-[#176b57]">Ver todos <Icon name="chevron" size={14} /></button></div>
        <TableHead labels={["Producto", "Tipo", "Cantidad", "Fecha"]} />
        <div>{movements.slice(0, 5).map((m) => <div key={m.id} className="grid grid-cols-[1.4fr_.8fr_.6fr_1fr] items-center border-t border-slate-100 px-6 py-4 text-sm"><span className="font-semibold text-slate-700">{m.product}</span><MovementType type={m.type} /><span className="text-slate-600">{m.quantity} unid.</span><span className="text-xs text-slate-500">{m.date.split(",")[0]}</span></div>)}</div>
      </div>
    </section>
  </div>;
}

function TableHead({ labels, cols }: { labels: string[]; cols?: string }) {
  return <div className={`grid ${cols ?? "grid-cols-[1.4fr_.8fr_.6fr_1fr]"} bg-slate-50 px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400`}>{labels.map((x) => <span key={x}>{x}</span>)}</div>;
}

function MovementType({ type }: { type: "Entrada" | "Salida" }) {
  return <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${type === "Entrada" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}><span className="text-sm">{type === "Entrada" ? "↓" : "↑"}</span>{type}</span>;
}

function Products({ products, onAdd, onView, onEdit, onDelete }: { products: Product[]; onAdd: () => void; onView: (p: Product) => void; onEdit: (p: Product) => void; onDelete: (id: number) => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const filtered = products.filter((p) => (!search || `${p.code} ${p.name}`.toLowerCase().includes(search.toLowerCase())) && (!category || p.category === category) && (!status || p.status === status));
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-slate-900">Productos</h2><p className="mt-1 text-sm text-slate-500">{filtered.length} productos encontrados</p></div><Button onClick={onAdd}><Icon name="plus" size={17} />Registrar producto</Button></div>
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,.035)]">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
        <div className="relative"><span className="absolute left-3.5 top-3 text-slate-400"><Icon name="search" size={18} /></span><input className={`${inputClass} pl-11`} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por código o nombre..." /></div>
        <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Todas las categorías</option>{[...new Set(products.map((p) => p.category))].map((x) => <option key={x}>{x}</option>)}</select>
        <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos los estados</option><option>Disponible</option><option>Próximo a vencer</option><option>Vencido</option></select>
        <Button variant="secondary" onClick={() => { setSearch(""); setCategory(""); setStatus(""); }}>Limpiar filtros</Button>
      </div>
    </div>
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,.035)]">
      <div className="min-w-[1050px]">
        <TableHead labels={["Código", "Producto", "Categoría", "Cantidad", "Ingreso", "Vencimiento", "Estado", "Acciones"]} cols="grid-cols-[.75fr_1.25fr_1fr_.7fr_1fr_1fr_1.2fr_.8fr]" />
        {filtered.map((p) => <div key={p.id} className="grid grid-cols-[.75fr_1.25fr_1fr_.7fr_1fr_1fr_1.2fr_.8fr] items-center border-t border-slate-100 px-6 py-4 text-sm transition hover:bg-slate-50/60">
          <span className="font-mono text-xs text-slate-500">{p.code}</span><span className="font-semibold text-slate-800">{p.name}</span><span className="text-slate-500">{p.category}</span><span className="font-semibold">{p.quantity} <small className="font-normal text-slate-400">unid.</small></span><span className="text-xs text-slate-500">{formatDate(p.entry)}</span><span className="text-xs font-medium text-slate-600">{formatDate(p.expiry)}</span><Status value={p.status} />
          <div className="flex gap-1"><Action label="Ver" icon="eye" onClick={() => onView(p)} /><Action label="Editar" icon="edit" onClick={() => onEdit(p)} /><Action label="Eliminar" icon="trash" danger onClick={() => onDelete(p.id)} /></div>
        </div>)}
        {!filtered.length && <div className="p-12 text-center text-sm text-slate-400">No se encontraron productos con esos filtros.</div>}
      </div>
    </div>
  </div>;
}

function Action({ label, icon, onClick, danger }: { label: string; icon: string; onClick: () => void; danger?: boolean }) {
  return <button title={label} aria-label={label} onClick={onClick} className={`grid h-8 w-8 place-items-center rounded-md transition ${danger ? "text-rose-500 hover:bg-rose-50" : "text-slate-400 hover:bg-slate-100 hover:text-[#176b57]"}`}><Icon name={icon} size={16} /></button>;
}

function ProductForm({ product, onCancel, onSave }: { product: Product | null; onCancel: () => void; onSave: (p: Omit<Product, "id">) => void }) {
  const [form, setForm] = useState<Omit<Product, "id">>(product ? { ...product } : { code: `PRD-${String(Math.floor(Math.random() * 900) + 100)}`, name: "", category: "", quantity: 0, entry: "2025-06-05", expiry: "", status: "Disponible" });
  const update = (key: keyof typeof form, value: string | number) => setForm({ ...form, [key]: value });
  return <div className="mx-auto max-w-4xl">
    <button onClick={onCancel} className="mb-5 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800"><Icon name="back" size={17} />Volver a productos</button>
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_14px_rgba(15,23,42,.04)]">
      <div className="border-b border-slate-100 px-7 py-6"><h2 className="text-lg font-bold text-slate-900">{product ? "Editar producto" : "Información del nuevo producto"}</h2><p className="mt-1 text-sm text-slate-500">Los campos marcados son necesarios para el control del inventario.</p></div>
      <div className="grid gap-6 p-7 md:grid-cols-2">
        <Field label="Código del producto"><input required className={inputClass} value={form.code} onChange={(e) => update("code", e.target.value)} /></Field>
        <Field label="Nombre del producto"><input required className={inputClass} placeholder="Ej. Leche entera" value={form.name} onChange={(e) => update("name", e.target.value)} /></Field>
        <Field label="Categoría"><select required className={inputClass} value={form.category} onChange={(e) => update("category", e.target.value)}><option value="">Selecciona una categoría</option>{["Lácteos", "Frutas", "Carnes", "Panadería", "Verduras", "Bebidas"].map((x) => <option key={x}>{x}</option>)}</select></Field>
        <Field label="Cantidad inicial"><input required min="0" type="number" className={inputClass} value={form.quantity} onChange={(e) => update("quantity", Number(e.target.value))} /></Field>
        <Field label="Fecha de ingreso"><input required type="date" className={inputClass} value={form.entry} onChange={(e) => update("entry", e.target.value)} /></Field>
        <Field label="Fecha de vencimiento"><input required type="date" className={inputClass} value={form.expiry} onChange={(e) => update("expiry", e.target.value)} /></Field>
        <Field label="Estado"><select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value)}><option>Disponible</option><option>Próximo a vencer</option><option>Vencido</option></select></Field>
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-7 py-5"><Button variant="secondary" onClick={onCancel}>Cancelar</Button><Button type="submit">{product ? "Guardar cambios" : "Guardar producto"}</Button></div>
    </form>
  </div>;
}

function ProductDetail({ product, movements, onBack, onEdit }: { product: Product; movements: Movement[]; onBack: () => void; onEdit: (p: Product) => void }) {
  const details = [["Código", product.code], ["Categoría", product.category], ["Cantidad actual", `${product.quantity} unidades`], ["Fecha de ingreso", formatDate(product.entry)], ["Fecha de vencimiento", formatDate(product.expiry)]];
  return <div className="mx-auto max-w-5xl space-y-6">
    <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800"><Icon name="back" size={17} />Volver a productos</button>
    <div className="rounded-xl border border-slate-200/80 bg-white p-7 shadow-[0_2px_14px_rgba(15,23,42,.04)]">
      <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-start"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-50 text-[#176b57]"><Icon name="package" size={27} /></div><div><div className="mb-2"><Status value={product.status} /></div><h2 className="text-2xl font-bold text-slate-900">{product.name}</h2></div></div><Button onClick={() => onEdit(product)}><Icon name="edit" size={16} />Editar producto</Button></div>
      <div className="grid gap-x-8 gap-y-6 pt-7 sm:grid-cols-2 lg:grid-cols-3">{details.map(([key, value]) => <div key={key}><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{key}</p><p className="mt-2 text-sm font-semibold text-slate-800">{value}</p></div>)}</div>
    </div>
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_14px_rgba(15,23,42,.04)]"><div className="p-6"><h3 className="font-bold text-slate-900">Historial de movimientos</h3><p className="mt-1 text-xs text-slate-500">Últimas entradas y salidas registradas</p></div><TableHead labels={["Fecha", "Tipo de movimiento", "Cantidad"]} cols="grid-cols-3" />{(movements.filter((m) => m.product === product.name).length ? movements.filter((m) => m.product === product.name) : movements.slice(0, 3)).map((m) => <div key={m.id} className="grid grid-cols-3 items-center border-t border-slate-100 px-6 py-4 text-sm"><span className="text-slate-500">{m.date}</span><MovementType type={m.type} /><span className="font-semibold">{m.quantity} unidades</span></div>)}</div>
  </div>;
}

function Movements({ movements, products, onAdd }: { movements: Movement[]; products: Product[]; onAdd: (m: Omit<Movement, "id">) => void }) {
  const [modal, setModal] = useState<"Entrada" | "Salida" | null>(null);
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-slate-900">Historial de movimientos</h2><p className="mt-1 text-sm text-slate-500">{movements.length} movimientos registrados</p></div><div className="flex gap-3"><Button variant="secondary" onClick={() => setModal("Salida")}><Icon name="plus" size={16} />Registrar salida</Button><Button onClick={() => setModal("Entrada")}><Icon name="plus" size={16} />Registrar entrada</Button></div></div>
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,.035)]"><div className="min-w-[800px]"><TableHead labels={["Producto", "Tipo", "Cantidad", "Fecha", "Usuario responsable"]} cols="grid-cols-[1.3fr_.8fr_.7fr_1.2fr_1fr]" />{movements.map((m) => <div key={m.id} className="grid grid-cols-[1.3fr_.8fr_.7fr_1.2fr_1fr] items-center border-t border-slate-100 px-6 py-4 text-sm"><span className="font-semibold">{m.product}</span><MovementType type={m.type} /><span>{m.quantity} unid.</span><span className="text-slate-500">{m.date}</span><span className="text-slate-600">{m.user}</span></div>)}</div></div>
    {modal && <MovementModal type={modal} products={products} onClose={() => setModal(null)} onSave={(m) => { onAdd(m); setModal(null); }} />}
  </div>;
}

function MovementModal({ type, products, onClose, onSave }: { type: "Entrada" | "Salida"; products: Product[]; onClose: () => void; onSave: (m: Omit<Movement, "id">) => void }) {
  const [product, setProduct] = useState(products[0]?.name ?? "");
  const [quantity, setQuantity] = useState(1);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-5"><form onSubmit={(e) => { e.preventDefault(); onSave({ product, type, quantity, date: "05 jun 2025, 10:30", user: "Ana Torres" }); }} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"><div className="border-b border-slate-100 p-6"><h3 className="text-lg font-bold">Registrar {type.toLowerCase()}</h3><p className="mt-1 text-sm text-slate-500">Completa los datos del movimiento de inventario.</p></div><div className="space-y-5 p-6"><Field label="Producto"><select className={inputClass} value={product} onChange={(e) => setProduct(e.target.value)}>{products.map((p) => <option key={p.id}>{p.name}</option>)}</select></Field><Field label="Tipo de movimiento"><input disabled className={`${inputClass} bg-slate-50`} value={type} /></Field><div className="grid grid-cols-2 gap-4"><Field label="Cantidad"><input min="1" required type="number" className={inputClass} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></Field><Field label="Fecha"><input type="date" className={inputClass} value="2025-06-05" readOnly /></Field></div></div><div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 p-5"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button type="submit">Registrar {type.toLowerCase()}</Button></div></form></div>;
}

function Expirations({ products, onView }: { products: Product[]; onView: (p: Product) => void }) {
  const soon = products.filter((p) => p.status === "Próximo a vencer");
  const expired = products.filter((p) => p.status === "Vencido");
  return <div className="space-y-7">
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-5 rounded-xl border border-amber-200/70 bg-amber-50/70 p-6"><div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-700"><Icon name="clock" size={23} /></div><div><p className="text-3xl font-bold text-amber-900">{soon.length}</p><p className="text-sm font-semibold text-amber-800">Productos próximos a vencer</p></div></div>
      <div className="flex items-center gap-5 rounded-xl border border-rose-200/70 bg-rose-50/70 p-6"><div className="grid h-12 w-12 place-items-center rounded-xl bg-rose-100 text-rose-700"><Icon name="calendar" size={23} /></div><div><p className="text-3xl font-bold text-rose-900">{expired.length}</p><p className="text-sm font-semibold text-rose-800">Productos vencidos</p></div></div>
    </div>
    <ExpirySection title="Productos próximos a vencer" subtitle="Revisa estos productos y toma las acciones necesarias." products={soon} tone="amber" onView={onView} />
    <ExpirySection title="Productos vencidos" subtitle="Estos productos superaron la fecha de vencimiento registrada." products={expired} tone="rose" onView={onView} />
  </div>;
}

function ExpirySection({ title, subtitle, products, tone, onView }: { title: string; subtitle: string; products: Product[]; tone: "amber" | "rose"; onView: (p: Product) => void }) {
  return <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,.035)]"><div className={`border-l-4 p-6 ${tone === "amber" ? "border-amber-400" : "border-rose-500"}`}><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div><TableHead labels={["Producto", "Cantidad", "Fecha de vencimiento", "Estado", "Acción"]} cols="grid-cols-[1.4fr_.7fr_1fr_1fr_.5fr]" />{products.map((p) => <div key={p.id} className="grid grid-cols-[1.4fr_.7fr_1fr_1fr_.5fr] items-center border-t border-slate-100 px-6 py-4 text-sm"><span className="font-semibold">{p.name}</span><span>{p.quantity} unid.</span><span className="text-slate-600">{formatDate(p.expiry)}</span><Status value={p.status} /><button onClick={() => onView(p)} className="text-xs font-bold text-[#176b57]">Ver detalle</button></div>)}</section>;
}

function Users({ users, setUsers }: { users: typeof usersSeed; setUsers: (u: typeof usersSeed) => void }) {
  const [modal, setModal] = useState(false);
  const addUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name"));
    setUsers([...users, { id: Date.now(), code: `USR-${String(users.length + 1).padStart(3, "0")}`, name, email: String(fd.get("email")), role: String(fd.get("role")), active: true }]);
    setModal(false);
  };
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-slate-900">Usuarios</h2><p className="mt-1 text-sm text-slate-500">{users.length} usuarios registrados</p></div><Button onClick={() => setModal(true)}><Icon name="plus" size={17} />Registrar usuario</Button></div>
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,.035)]"><div className="min-w-[900px]"><TableHead labels={["Código", "Nombre", "Correo", "Rol", "Estado", "Acciones"]} cols="grid-cols-[.7fr_1fr_1.5fr_1fr_.8fr_.7fr]" />{users.map((u) => <div key={u.id} className="grid grid-cols-[.7fr_1fr_1.5fr_1fr_.8fr_.7fr] items-center border-t border-slate-100 px-6 py-4 text-sm"><span className="font-mono text-xs text-slate-500">{u.code}</span><span className="font-semibold">{u.name}</span><span className="text-slate-500">{u.email}</span><span className="text-slate-600">{u.role}</span><span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${u.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{u.active ? "Activo" : "Inactivo"}</span><div className="flex items-center gap-2"><Action label="Editar" icon="edit" onClick={() => {}} /><button onClick={() => setUsers(users.map((x) => x.id === u.id ? { ...x, active: !x.active } : x))} className="text-xs font-bold text-[#176b57]">{u.active ? "Desactivar" : "Activar"}</button></div></div>)}</div></div>
    {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-5"><form onSubmit={addUser} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"><div className="border-b border-slate-100 p-6"><h3 className="text-lg font-bold">Registrar usuario</h3><p className="mt-1 text-sm text-slate-500">Crea un acceso sencillo para el sistema.</p></div><div className="space-y-5 p-6"><Field label="Nombre completo"><input required name="name" className={inputClass} placeholder="Nombre y apellido" /></Field><Field label="Correo electrónico"><input required type="email" name="email" className={inputClass} placeholder="usuario@institucion.edu" /></Field><Field label="Rol"><select name="role" className={inputClass}><option>Usuario</option><option>Administrador</option></select></Field></div><div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 p-5"><Button variant="secondary" onClick={() => setModal(false)}>Cancelar</Button><Button type="submit">Guardar usuario</Button></div></form></div>}
  </div>;
}

function formatDate(value: string) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
