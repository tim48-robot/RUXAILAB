/**
 * Automatically cleans up HTML tag names from Figma's "html.to.design" plugin
 * by injecting an `id` or `data-label` onto every single element that lacks one.
 */
document.querySelectorAll('*').forEach(el => {
  // If it already has an ID, let it be.
  if (el.id) return;
  
  const tag = el.tagName.toLowerCase();
  
  // Skip invisible/unimportant tags
  if (['html', 'body', 'head', 'style', 'script', 'meta', 'title', 'link'].includes(tag)) return;
  
  let label = tag;
  
  // Try to use Vuetify class names for a better description
  const vClass = Array.from(el.classList).find(c => c.startsWith('v-'));
  if (vClass) {
    // e.g. v-btn__content -> btn content
    label = vClass.replace(/^v-/, '').replace(/__/g, ' ').replace(/-/g, ' ');
    // capitalize
    label = label.replace(/\b\w/g, l => l.toUpperCase());
  } else if (el.classList.length > 0) {
    // If no v- class, use the first available class
    label = el.classList[0].replace(/-/g, ' ');
    label = label.replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Fallbacks for specific tags
  if (tag === 'i' || tag === 'svg' || tag === 'path') label = 'Icon';
  if (tag === 'span' && el.textContent.trim().length > 0) label = 'Text';
  if (tag === 'img') label = 'Image';
  
  // Apply the label as the ID so Figma picks it up
  el.id = label;
});
console.log("Cleanup script loaded.");
