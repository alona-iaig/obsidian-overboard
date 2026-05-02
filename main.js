var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => OverboardPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  embedHeight: 600,
  allowFullscreen: true
};
var HOST = "https://overboard.studio";
var BOARD_URL_RE = /^https:\/\/overboard\.studio\/board\/([a-zA-Z0-9_-]+)/;
var VALID_BOARD_ID_RE = /^[a-zA-Z0-9_-]+$/;
var OverboardPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings", DEFAULT_SETTINGS);
  }
  async onload() {
    await this.loadSettings();
    this.registerMarkdownCodeBlockProcessor("overboard", (source, el, ctx) => {
      this.renderBoard(source.trim(), el, ctx);
    });
    this.addCommand({
      id: "insert-overboard-board",
      name: "Insert Overboard board",
      editorCallback: (editor) => {
        const url = window.prompt("Paste an Overboard board URL (e.g. https://overboard.studio/board/abc123):");
        if (!url || !url.trim()) return;
        editor.replaceSelection("```overboard\n" + url.trim() + "\n```\n");
      }
    });
    this.addCommand({
      id: "open-new-overboard",
      name: "Open new Overboard board in browser",
      callback: () => window.open(HOST + "/boards", "_blank")
    });
    this.addSettingTab(new OverboardSettingTab(this.app, this));
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  renderBoard(input, el, _ctx) {
    let boardId = null;
    const urlMatch = input.match(BOARD_URL_RE);
    if (urlMatch) {
      boardId = urlMatch[1];
    } else if (VALID_BOARD_ID_RE.test(input) && input.length >= 4 && input.length <= 64) {
      boardId = input;
    }
    if (!boardId) {
      const err = el.createDiv({ cls: "overboard-error" });
      err.setText("Overboard: invalid board URL or ID. Expected https://overboard.studio/board/<id> or a bare board ID.");
      err.style.cssText = "padding: 12px; border: 1px solid #fecaca; background: #fef2f2; color: #991b1b; border-radius: 8px; font-size: 13px;";
      return;
    }
    const wrap = el.createDiv({ cls: "overboard-embed" });
    wrap.style.cssText = "border: 1px solid var(--background-modifier-border); border-radius: 10px; overflow: hidden; margin: 8px 0;";
    const header = wrap.createDiv({ cls: "overboard-embed-header" });
    header.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--background-secondary); font-size: 12px; color: var(--text-muted);";
    header.createSpan({ text: "Overboard board" });
    const openLink = header.createEl("a", {
      text: "Open in browser \u2197",
      href: `${HOST}/board/${encodeURIComponent(boardId)}`
    });
    openLink.setAttr("target", "_blank");
    openLink.setAttr("rel", "noopener noreferrer");
    openLink.style.cssText = "color: var(--text-accent); text-decoration: none; font-weight: 500;";
    const iframe = wrap.createEl("iframe");
    iframe.setAttr("src", `${HOST}/embed/board/${encodeURIComponent(boardId)}`);
    iframe.setAttr("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox");
    iframe.setAttr("referrerpolicy", "no-referrer-when-downgrade");
    iframe.setAttr("loading", "lazy");
    iframe.setAttr("title", "Overboard board");
    if (this.settings.allowFullscreen) iframe.setAttr("allow", "fullscreen");
    iframe.style.cssText = `width: 100%; height: ${this.settings.embedHeight}px; border: 0; display: block; background: white;`;
  }
};
var OverboardSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    __publicField(this, "plugin");
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Overboard" });
    new import_obsidian.Setting(containerEl).setName("Embed height (px)").setDesc("Height of the iframe inside your notes. Boards scroll/zoom internally so 600 is a reasonable default.").addText(
      (t) => t.setPlaceholder("600").setValue(String(this.plugin.settings.embedHeight)).onChange(async (v) => {
        const n = parseInt(v, 10);
        if (Number.isFinite(n) && n >= 200 && n <= 2e3) {
          this.plugin.settings.embedHeight = n;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(containerEl).setName("Allow fullscreen").setDesc("Let embedded boards request fullscreen mode.").addToggle(
      (t) => t.setValue(this.plugin.settings.allowFullscreen).onChange(async (v) => {
        this.plugin.settings.allowFullscreen = v;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("p", {
      text: "You sign in to Overboard inside the embedded iframe \u2014 the plugin never sees your credentials. All board data, AI generation, and collaboration runs on overboard.studio.",
      cls: "setting-item-description"
    });
    containerEl.createEl("a", {
      text: "Get an account at overboard.studio",
      href: HOST
    }).setAttr("target", "_blank");
  }
};
