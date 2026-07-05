/**
 * Injects Subscript and Superscript buttons into Strapi's WYSIWYG (CodeMirror 5)
 * markdown editor toolbar, immediately after the Strikethrough button.
 *
 * Technique: mousedown + preventDefault keeps focus in the editor, then we
 * access the CodeMirror 5 instance via wrapper.CodeMirror to wrap the selection.
 */

const BTN_ATTR = 'data-czp-subsup';

const STYLES = `
button[${BTN_ATTR}] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  color: inherit;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
}
button[${BTN_ATTR}]:hover {
  background: rgba(0,0,0,0.06);
}
button[${BTN_ATTR}] sub,
button[${BTN_ATTR}] sup {
  font-size: 9px;
  font-weight: 700;
}
`;

function injectStyles() {
  const id = 'czp-subsup-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

interface CodeMirror5Editor {
  getSelection(): string;
  replaceSelection(text: string, origin?: string): void;
  focus(): void;
}

interface CodeMirror5Wrapper extends HTMLElement {
  CodeMirror?: CodeMirror5Editor;
}

function getEditorInstance(toolbar: Element): CodeMirror5Editor | null {
  // The CodeMirror wrapper div (.CodeMirror) is a sibling of the toolbar
  // inside the WYSIWYG container.
  const container = toolbar.closest('[class]');
  if (!container) return null;
  // Walk up until we find the WYSIWYG root that contains a .CodeMirror div
  let node: Element | null = toolbar;
  while (node) {
    const wrapper = node.querySelector<CodeMirror5Wrapper>('.CodeMirror');
    if (wrapper?.CodeMirror) return wrapper.CodeMirror;
    node = node.parentElement;
    if (!node || node === document.body) break;
  }
  return null;
}

function wrapSelection(tag: string, toolbar: Element) {
  const editor = getEditorInstance(toolbar);
  if (!editor) return;
  const selected = editor.getSelection();
  editor.replaceSelection(`<${tag}>${selected}</${tag}>`, 'around');
  editor.focus();
}

function createButton(tag: string, label: string, html: string, toolbar: Element): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute(BTN_ATTR, tag);
  btn.setAttribute('aria-label', label);
  btn.title = label;
  btn.innerHTML = html;

  btn.addEventListener('mousedown', (e) => {
    e.preventDefault(); // keep CodeMirror focus
    wrapSelection(tag, toolbar);
  });

  return btn;
}

function injectIntoToolbar(toolbar: Element) {
  if (toolbar.querySelector(`[${BTN_ATTR}]`)) return; // already injected

  // Find the Strikethrough button to insert after its group
  const strikeBtn = toolbar.querySelector<HTMLButtonElement>(
    'button[aria-label*="trike"]'
  );
  if (!strikeBtn) return;

  // Walk up to the IconButtonGroup container (grandparent of the button)
  const observerWrapper = strikeBtn.parentElement; // EditorToolbarObserver div
  const buttonGroup = observerWrapper?.parentElement;  // IconButtonGroup
  if (!buttonGroup) return;

  const subBtn = createButton('sub', 'Subscript', 'X<sub>2</sub>', toolbar);
  const supBtn = createButton('sup', 'Superscript', 'X<sup>2</sup>', toolbar);

  // Insert after the strikethrough observer wrapper
  observerWrapper!.after(subBtn, supBtn);
}

function scanAndInject() {
  // A toolbar is present when a Bold button exists
  document.querySelectorAll<HTMLButtonElement>('button[aria-label="Bold"]').forEach((boldBtn) => {
    // Walk up to find the flex toolbar row
    const toolbar = boldBtn.closest('[class]')?.parentElement?.parentElement;
    if (toolbar) injectIntoToolbar(toolbar);
  });
}

export function initWysiwygSubSup() {
  if (typeof window === 'undefined') return;

  injectStyles();

  let debounce: ReturnType<typeof setTimeout> | null = null;
  const observer = new MutationObserver(() => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      debounce = null;
      scanAndInject();
    }, 150);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
