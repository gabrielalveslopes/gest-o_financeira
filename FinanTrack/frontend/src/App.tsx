
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  CircleDollarSign,
  LayoutDashboard,
  Menu,
  Plus,
  Settings,
  Target,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import "./App.css";

const transactions = [
  { id: 1, name: "Salário", category: "Renda", date: "23 out", amount: 1100, type: "income" },
  { id: 2, name: "Conta de energia", category: "Moradia", date: "22 out", amount: -300, type: "expense" },
  { id: 3, name: "Plano de celular", category: "Comunicação", date: "20 out", amount: -30, type: "expense" },
  { id: 4, name: "Spotify", category: "Assinaturas", date: "18 out", amount: -12, type: "expense" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const income = transactions
    .filter((item) => item.amount > 0)
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.amount < 0)
    .reduce((total, item) => total + Math.abs(item.amount), 0);

  const balance = income - expenses;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Wallet size={23} /></div>
          <span>Finan<span className="brand-accent">Track</span></span>
          <button className="icon-button close-menu" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <p className="nav-label">MENU PRINCIPAL</p>
        <nav className="navigation">
          <a className="nav-item active" href="#dashboard" onClick={() => setMenuOpen(false)}>
            <LayoutDashboard size={19} /> Visão geral
          </a>
          <a className="nav-item" href="#transactions" onClick={() => setMenuOpen(false)}>
            <CircleDollarSign size={19} /> Transações
          </a>
          <a className="nav-item" href="#goals" onClick={() => setMenuOpen(false)}>
            <Target size={19} /> Metas financeiras
          </a>
          <a className="nav-item" href="#settings" onClick={() => setMenuOpen(false)}>
            <Settings size={19} /> Configurações
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="tip-card">
            <Target size={21} />
            <strong>Seu dinheiro, suas metas.</strong>
            <p>Acompanhe seus gastos e planeje seus próximos passos.</p>
          </div>
          <div className="profile">
            <div className="avatar">FT</div>
            <div><strong>Meu espaço</strong><span>Finanças pessoais</span></div>
          </div>
        </div>
      </aside>

      {menuOpen && <button className="menu-backdrop" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Menu size={23} />
            </button>
            <div>
              <p className="eyebrow">SEU PAINEL FINANCEIRO</p>
              <h1>Visão geral</h1>
            </div>
          </div>
          <button className="icon-button notification-button" aria-label="Notificações">
            <Bell size={20} />
          </button>
        </header>

        <section className="welcome-row">
          <div>
            <h2>Suas finanças em um só lugar.</h2>
            <p>Acompanhe seu dinheiro e tome decisões melhores.</p>
          </div>
          <button className="primary-button" onClick={() => alert("Na próxima etapa, vamos criar o formulário de transações.")}>
            <Plus size={19} /> Nova transação
          </button>
        </section>

        <section className="summary-grid" aria-label="Resumo financeiro">
          <article className="summary-card balance-card">
            <div className="card-heading"><span>Saldo atual</span><div className="metric-icon"><Wallet size={20} /></div></div>
            <strong className="metric-value">{formatCurrency(balance)}</strong>
            <span className="metric-footnote">Saldo calculado pelas transações de exemplo</span>
          </article>
          <article className="summary-card">
            <div className="card-heading"><span>Receitas</span><div className="metric-icon income-icon"><ArrowDownLeft size={20} /></div></div>
            <strong className="metric-value">{formatCurrency(income)}</strong>
            <span className="metric-footnote">Entradas registradas</span>
          </article>
          <article className="summary-card">
            <div className="card-heading"><span>Despesas</span><div className="metric-icon expense-icon"><ArrowUpRight size={20} /></div></div>
            <strong className="metric-value">{formatCurrency(expenses)}</strong>
            <span className="metric-footnote">Saídas registradas</span>
          </article>
        </section>

        <section className="transactions-panel" id="transactions">
          <div className="panel-header">
            <div><h2>Transações recentes</h2><p>Movimentações financeiras de exemplo</p></div>
            <button className="text-button" onClick={() => alert("Vamos implementar o histórico completo em seguida.")}>Ver todas</button>
          </div>
          <div className="transaction-table">
            <div className="transaction-row table-heading">
              <span>DESCRIÇÃO</span><span>CATEGORIA</span><span>DATA</span><span className="amount-heading">VALOR</span>
            </div>
            {transactions.map((transaction) => (
              <div className="transaction-row" key={transaction.id}>
                <div className="transaction-name">
                  <div className={`transaction-icon ${transaction.type}`}>
                    {transaction.type === "income" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <strong>{transaction.name}</strong>
                </div>
                <span className="category">{transaction.category}</span>
                <span className="transaction-date">{transaction.date}</span>
                <strong className={`transaction-amount ${transaction.type}`}>
                  {transaction.amount > 0 ? "+" : "−"} {formatCurrency(Math.abs(transaction.amount))}
                </strong>
              </div>
            ))}
          </div>
          <p className="demo-notice">Os dados exibidos são exemplos locais. Ainda não estão salvos no banco de dados.</p>
        </section>

        <footer className="footer">
          <span>FinanTrack · Gestão financeira pessoal</span>
          <span>Versão inicial · 0.1.0</span>
        </footer>
      </main>
    </div>
  );
}
