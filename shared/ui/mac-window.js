// Mac OS Window Component
export class MacWindow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                }
                
                .window {
                    background: rgba(30, 30, 30, 0.95);
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                    min-width: 400px;
                    min-height: 300px;
                }

                .titlebar {
                    height: 38px;
                    background: linear-gradient(180deg, #3a3a3a 0%, #2d2d2d 100%);
                    display: flex;
                    align-items: center;
                    padding: 0 12px;
                    -webkit-app-region: drag;
                    user-select: none;
                }

                .buttons {
                    display: flex;
                    gap: 8px;
                    -webkit-app-region: no-drag;
                }

                .btn {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }

                .btn:hover { opacity: 0.8; }
                .btn-close { background: #ff5f56; }
                .btn-min { background: #febc2e; }
                .btn-max { background: #28c840; }

                .title {
                    flex: 1;
                    text-align: center;
                    font-size: 13px;
                    color: #888;
                }

                .content {
                    padding: 16px;
                    color: #ddd;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
            </style>

            <div class="window">
                <div class="titlebar">
                    <div class="buttons">
                        <button class="btn btn-close"></button>
                        <button class="btn btn-min"></button>
                        <button class="btn btn-max"></button>
                    </div>
                    <div class="title"><slot name="title">Untitled</slot></div>
                </div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('mac-window', MacWindow);
export default MacWindow;
