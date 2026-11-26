
const API_URL = "http://127.0.0.1:8000";

export type Transaction = {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
};

export type TransactionInput = Omit<Transaction, "id">;

type ApiTransaction = {
  id: number;
  descricao: string;
  tipo: "income" | "expense";
  categoria: string;
  valor: number | string;
  data: string;
};

function convertTransaction(data: ApiTransaction): Transaction {
  return {
    id: data.id,
    name: data.descricao,
    category: data.categoria,
    date: data.data,
    amount: Number(data.valor),
    type: data.tipo,
  };
}

async function handleResponse(response: Response): Promise<void> {
  if (!response.ok) {
    let message = "Não foi possível realizar a operação.";

    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      // Mantém a mensagem padrão caso a resposta não tenha JSON.
    }

    throw new Error(message);
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/api/transacoes`);

  await handleResponse(response);

  const data: ApiTransaction[] = await response.json();

  return data.map(convertTransaction);
}

export async function createTransaction(
  transaction: TransactionInput
): Promise<Transaction> {
  const response = await fetch(`${API_URL}/api/transacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descricao: transaction.name,
      tipo: transaction.type,
      categoria: transaction.category,
      valor: transaction.amount,
      data: transaction.date,
    }),
  });

  await handleResponse(response);

  const data: ApiTransaction = await response.json();

  return convertTransaction(data);
}

export async function deleteTransaction(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/transacoes/${id}`, {
    method: "DELETE",
  });

  await handleResponse(response);
}
