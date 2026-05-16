import DOMPurify from 'dompurify'

const HTML_SANITIZE_CONFIG = {
  USE_PROFILES: { html: true },
}

export function sanitizeHtml(value) {
  const normalizedValue = value == null ? '' : String(value)
  return DOMPurify.sanitize(normalizedValue, HTML_SANITIZE_CONFIG)
}
