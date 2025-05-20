// Fungsi untuk menghasilkan ID unik
export function generateId(): string {
  return crypto.randomUUID();
}
