/** Erreur métier avec code stable, convertie en HttpsError par les handlers. */
export class DomainError extends Error {
  /**
   * @param {string} code Code stable lisible par machine.
   * @param {string} message Message lisible par un humain (français).
   */
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "DomainError";
  }
}
