import DOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';

/**
 * Funkcja sanitizująca HTML.
 * @param rawHtml - Surowy HTML wejściowy.
 * @param allowedImageDomains - Lista dozwolonych domen dla obrazków.
 * @returns Bezpieczny HTML do renderowania.
 */
export function sanitizePostContent(rawHtml: string, allowedImageDomains: string[] = ['localhost']): string {
  // Konfiguracja DOMPurify
  const purifyConfig = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br',
      'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'img',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target'],
  };

  // Sanityzujemy HTML
  const sanitizedHtml = DOMPurify.sanitize(rawHtml, purifyConfig);

  // Obsługa DOMParser na serwerze za pomocą jsdom
  const jsdom = new JSDOM();
  const parser = new jsdom.window.DOMParser();

  const doc = parser.parseFromString(sanitizedHtml, 'text/html');
  const images = doc.querySelectorAll('img');

  // Filtrowanie obrazków na podstawie dozwolonych domen
  images.forEach((img) => {
    const src = img.getAttribute('src') || '';
    const isAllowed = allowedImageDomains.some((domain) =>
      src.startsWith(`https://${domain}`) || src.startsWith(`http://${domain}`)
    );

    if (!isAllowed) {
      img.remove(); // Usuń obrazek z niedozwolonego źródła
    }
  });

  return doc.body.innerHTML; // Zwracamy przefiltrowany HTML
}
