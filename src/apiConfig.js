const baseUrl = 'http://localhost:8080';

export const apiEndpoints = {
  setup: `${baseUrl}/setup`,
  transact: (walletId) => `${baseUrl}/transact/${walletId}`,
  transactions: (walletId, page, limit) => `${baseUrl}/transactions?walletId=${walletId}&skip=${(page - 1) * limit}&limit=${limit}`,
  wallet: (id) => `${baseUrl}/wallet/${id}`,
};
