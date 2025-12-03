/**
 * Utility function to handle smooth scrolling to anchor links
 * Works with both regular anchor links and Next.js routing
 */
export function smoothScrollToAnchor(href: string) {
  // Extract hash from href
  const hash = href.includes("#") ? href.split("#")[1] : null;
  
  if (!hash) return;
  
  // Wait for next tick to ensure DOM is ready
  setTimeout(() => {
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 0);
}

/**
 * Hook to handle smooth scrolling on mount if URL has hash
 */
export function useSmoothScrollOnMount() {
  if (typeof window !== "undefined") {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }
}

