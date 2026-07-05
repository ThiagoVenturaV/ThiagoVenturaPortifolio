/**
 * widget.js
 *
 * Classe principal do LibrasWidget.
 * Apenas inicializa o VLibras oficial e orquestra o translator + MutationObserver.
 */

import { translate } from './translator.js';
import {
  loadVLibras,
  openVLibrasPanel,
  isPanelOpen,
} from './vlibras-loader.js';

export class Widget {
  /**
   * @param {Object} options
   * @param {string}  [options.watchSelector=null] - Seletor CSS dos elementos a observar
   * @param {boolean} [options.autoTranslate=true] - Traduz automaticamente ao detectar elemento novo
   * @param {number}  [options.autoTranslateDelay=400] - Delay (ms) antes de traduzir elemento novo
   */
  constructor(options = {}) {
    this.options = {
      watchSelector: null,
      autoTranslate: true,
      autoTranslateDelay: 400,
      ...options,
    };

    this._ready = false;
    this._observer = null;

    this._build();
  }

  /* ── Setup ──────────────────────────────────────────────────── */

  async _build() {
    try {
      // Carrega o VLibras oficial com o botão nativo azul
      await loadVLibras();
      this._ready = true;

      // Inicia observer se configurado
      if (this.options.watchSelector) {
        this._startObserver();
      }
    } catch (err) {
      console.error('[LibrasWidget]', err);
    }
  }

  /* ── MutationObserver ───────────────────────────────────────── */

  _startObserver() {
    const { watchSelector, autoTranslate, autoTranslateDelay } = this.options;

    this._observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;

          const targets = node.matches?.(watchSelector)
            ? [node]
            : [...(node.querySelectorAll?.(watchSelector) ?? [])];

          for (const target of targets) {
            if (target.dataset.lwObserved) continue;
            target.dataset.lwObserved = '1';

            if (autoTranslate) {
              setTimeout(() => {
                const text = target.innerText || target.textContent || '';
                if (text.trim()) this.translate(text.trim());
              }, autoTranslateDelay);
            }
          }
        }
      }
    });

    this._observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /* ── API pública ────────────────────────────────────────────── */

  /**
   * Traduz um texto específico para LIBRAS.
   * Abre o painel automaticamente se estiver fechado.
   * @param {string} texto
   */
  translate(texto) {
    if (!this._ready) {
      console.warn('[LibrasWidget] Widget ainda não está pronto. Aguarde o carregamento.');
      return;
    }
    if (!texto?.trim()) return;

    // Abre o painel se estiver fechado
    if (!isPanelOpen()) {
      openVLibrasPanel();
    }

    translate(texto);
  }

  /**
   * Para o MutationObserver.
   */
  destroy() {
    this._observer?.disconnect();
  }
}
