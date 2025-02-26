///
/// Tipo de manejador de eventos
///
type EventHandler = (error: Error) => void;

///
/// Clase de emisor de eventos simple
///
class SimpleEventEmitter {
  ///
  /// Manejadores de eventos
  ///
  private handlers: { [key: string]: EventHandler[] } = {};

  ///
  /// Agregar un manejador de eventos
  ///
  on(event: string, handler: EventHandler) {
    ///
    /// Si no existe el evento, crearlo
    ///
    if (!this.handlers[event]) {
      ///
      /// Crear el evento
      ///
      this.handlers[event] = [];
    }
    ///
    /// Agregar el manejador al evento
    ///
    this.handlers[event].push(handler);
  }

  ///
  /// Eliminar un manejador de eventos
  ///
  off(event: string, handler: EventHandler) {
    ///
    /// Si no existe el evento, retornar
    ///
    if (!this.handlers[event]) return;
    ///
    this.handlers[event] = this.handlers[event].filter((h) => h !== handler);
  }

  ///
  /// Emitir un evento
  ///
  emit(event: string, error: Error) {
    ///
    /// Si no existe el evento, retornar
    ///
    if (!this.handlers[event]) return;
    ///
    /// Emitir el evento
    ///
    this.handlers[event].forEach((handler) => handler(error));
  }
}

///
/// Emisor de eventos
///
export const eventEmitter = new SimpleEventEmitter();
