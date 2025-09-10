import { DzD1Dbase, createDzClient } from './dzconn';
import * as schema from './schema';

class D1DatabaseConnection {
  private static instance: D1DatabaseConnection;
  private db: DzD1Dbase | null = null;
  private d1Binding: D1Database | null = null;

  // Constructor privado para prevenir instanciación directa
  private constructor() {}

  /**
   * Obtiene la instancia singleton de la conexión a la base de datos
   */
  public static getInstance(): D1DatabaseConnection {
    if (!D1DatabaseConnection.instance) {
      D1DatabaseConnection.instance = new D1DatabaseConnection();
    }
    return D1DatabaseConnection.instance;
  }

  /**
   * Inicializa la conexión con la base de datos D1
   * @param d1Binding Instancia de D1Database de Cloudflare
   */
  public initialize(d1Binding: D1Database): void {
    if (this.db) {
      console.warn('La conexión a la base de datos ya ha sido inicializada');
      return;
    }

    this.d1Binding = d1Binding;
    this.db = createDzClient(this.d1Binding);
    console.log('Conexión a D1 inicializada correctamente');
  }

  /**
   * Obtiene la instancia de la base de datos
   * @throws Error si la conexión no ha sido inicializada
   */
  public getDB(): DzD1Dbase {
    if (!this.db) {
      throw new Error('La conexión a la base de datos no ha sido inicializada. Llama a initialize() primero.');
    }
    return this.db;
  }

  /**
   * Verifica si la conexión ha sido inicializada
   */
  public isInitialized(): boolean {
    return this.db !== null;
  }

  /**
   * Cierra la conexión (para SQLite/D1, esto es principalmente limpieza)
   */
  public async close(): Promise<void> {
    // Para D1, no hay una conexión persistente que cerrar como en otros DBMS,
    // pero podemos limpiar la referencia
    this.db = null;
    this.d1Binding = null;
    console.log('Conexión a D1 cerrada');
  }

  /**
   * Ejecuta una transacción
   */
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public async transaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    const db = this.getDB();
    return await db.transaction(callback);
  }

  /**
   * Obtiene el esquema de la base de datos
   */
  public getSchema() {
    return schema;
  }
}

// Exportar la instancia singleton
export const d1Connection = D1DatabaseConnection.getInstance();
