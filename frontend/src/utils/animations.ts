// Animation utilities for the dashboard

export const fadeIn = (element: HTMLElement, duration: number = 300) => {
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  
  requestAnimationFrame(() => {
    element.style.opacity = '1';
  });
};

export const slideInFromBottom = (element: HTMLElement, duration: number = 500) => {
  element.style.transform = 'translateY(20px)';
  element.style.opacity = '0';
  element.style.transition = `all ${duration}ms ease-out`;
  
  requestAnimationFrame(() => {
    element.style.transform = 'translateY(0)';
    element.style.opacity = '1';
  });
};

export const staggeredFadeIn = (elements: NodeListOf<HTMLElement> | HTMLElement[], delay: number = 100) => {
  elements.forEach((element, index) => {
    setTimeout(() => {
      fadeIn(element, 300);
    }, index * delay);
  });
};