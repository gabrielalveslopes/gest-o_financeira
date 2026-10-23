
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
  Trash2,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import "./App.css";

type TransactionType = "income" | "expense";

type Transaction = {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
};

const initialTransactions: Transaction[] = [
  { id: 1, name: "Salário", category: "Salário", date: "2026-10-23", amount: 1100, type: "income" },
  { id: 2, name: "Conta de energia", category: "Moradia", date: "2026-10-22", amount: 300, type: "expense" },
  { id: 3, name: "Plano de celular", category: "Comunicação", date: "2026-10-20", amount: 30, type: "expense" },
  { id: 4, name: "Spotify", category: "Assinaturas", date: "2026-10-18", amount: 12, type: "expense" },
];

const categories: Record<TransactionType, string[]> = {
  income: ["Salário", "Freelance", "Investimentos", "Presente", "Outros"],
  expense: ["Moradia", "Alimentação", "Transporte", "Comunicação", "Assinaturas", "Saúde", "Lazer", "Educação", "Outros"],
};

function todayAsInputDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  }).replace(".", "");
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Moradia");
  const [date, setDate] = useState(todayAsInputDate());
  const [error, setError] = useState("");

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  function openForm() {
    setType("expense");
    setName("");
    setAmount("");
    setCategory("Moradia");
    setDate(todayAsInputDate());
    setError("");
    setFormOpen(true);
  }

  function handleTypeChange(newType: TransactionType) {
    setType(newType);
    setCategory(categories[newType][0]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount.replace(",", "."));

    if (!name.trim()) {
      setError("Informe a descrição da transação.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }

    if (!date) {
      setError("Selecione a data da transação.");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      name: name.trim(),
      category,
      date,
      amount: numericAmount,
      type,
    };

    setTransactions((current) => [newTransaction, ...current]);
    setFormOpen(false);
  }

  function deleteTransaction(id: number) {
    const confirmed = window.confirm("Deseja excluir esta transação?");
    if (confirmed) {
      setTransactions((current) => current.filter((item) => item.id !== id));
    }
  }

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
          <a className="nav-item" href="#goals" onClick={(event) => { event.preventDefault(); setMenuOpen(false); }}>
            <Target size={19} /> Metas financeiras
          </a>
          <a className="nav-item" href="#settings" onClick={(event) => { event.preventDefault(); setMenuOpen(false); }}>
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
          <button className="primary-button" onClick={openForm}>
            <Plus size={19} /> Nova transação
          </button>
        </section>

        <section className="summary-grid" aria-label="Resumo financeiro">
          <article className="summary-card balance-card">
            <div className="card-heading"><span>Saldo atual</span><div className="metric-icon"><Wallet size={20} /></div></div>
            <strong className="metric-value">{formatCurrency(balance)}</strong>
            <span className="metric-footnote">Saldo das transações cadastradas</span>
          </article>
          <article className="summary-card">
            <div className="card-heading"><span>Receitas</span><div className="metric-icon income-icon"><ArrowDownLeft size={20} /></div></div>
            <strong className="metric-value">{formatCurrency(income)}</strong>
            <span className="metric-footnote">Entradas cadastradas</span>
          </article>
          <article className="summary-card">
            <div className="card-heading"><span>Despesas</span><div className="metric-icon expense-icon"><ArrowUpRight size={20} /></div></div>
            <strong className="metric-value">{formatCurrency(expenses)}</strong>
            <span className="metric-footnote">Saídas cadastradas</span>
          </article>
        </section>

        <section className="transactions-panel" id="transactions">
          <div className="panel-header">
            <div><h2>Transações recentes</h2><p>Movimentações financeiras cadastradas</p></div>
          </div>

          <div className="transaction-table">
            <div className="transaction-row table-heading">
              <span>DESCRIÇÃO</span><span>CATEGORIA</span><span>DATA</span><span className="amount-heading">VALOR</span>
            </div>
            {transactions.length === 0 && (
              <p className="empty-state">Nenhuma transação cadastrada. Clique em “Nova transação” para começar.</p>
            )}
            {transactions.map((transaction) => (
              <div className="transaction-row" key={transaction.id}>
                <div className="transaction-name">
                  <div className={`transaction-icon ${transaction.type}`}>
                    {transaction.type === "income" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <strong>{transaction.name}</strong>
                </div>
                <span className="category">{transaction.category}</span>
                <span className="transaction-date">{formatDate(transaction.date)}</span>
                <div className="transaction-actions">
                  <strong className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === "income" ? "+" : "−"} {formatCurrency(transaction.amount)}
                  </strong>
                  <button className="delete-button" onClick={() => deleteTransaction(transaction.id)} aria-label={`Excluir ${transaction.name}`} title="Excluir transação">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="demo-notice">Nesta etapa, as alterações ficam apenas na memória da página. Ainda não há salvamento permanente.</p>
        </section>

        <footer className="footer">
          <span>FinanTrack · Gestão financeira pessoal</span>
          <span>Versão inicial · 0.2.0</span>
        </footer>
      </main>

      {formOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setFormOpen(false);
        }}>
          <section className="transaction-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">MOVIMENTAÇÃO FINANCEIRA</p>
                <h2 id="form-title">Nova transação</h2>
              </div>
              <button className="icon-button" onClick={() => setFormOpen(false)} aria-label="Fechar formulário">
                <X size={20} />
              </button>
            </div>

            <form className="transaction-form" onSubmit={handleSubmit}>
              <fieldset className="type-selector">
                <legend>Tipo de transação</legend>
                <button type="button" className={type === "expense" ? "type-option selected expense-option" : "type-option"} onClick={() => handleTypeChange("expense")}>
                  <ArrowUpRight size={18} /> Despesa
                </button>
                <button type="button" className={type === "income" ? "type-option selected income-option" : "type-option"} onClick={() => handleTypeChange("income")}>
                  <ArrowDownLeft size={18} /> Receita
                </button>
              </fieldset>

              <label className="form-field">
                Descrição
                <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Compra no supermercado" maxLength={100} required />
              </label>

              <label className="form-field">
                Valor (R$)
                <input type="text" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" required />
              </label>

              <label className="form-field">
                Categoria
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories[type].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label className="form-field">
                Data
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setFormOpen(false)}>Cancelar</button>
                <button type="submit" className="primary-button"><Plus size={18} /> Salvar transação</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
