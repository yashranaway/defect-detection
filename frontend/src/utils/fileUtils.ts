// File utility functions

export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const generateFileName = (prefix: string, extension: string): string => {
  const timestamp = new Date().getTime();
  return `${prefix}_${timestamp}.${extension}`;
};

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  let arr = dataurl.split(',');
  if (arr.length < 2) {
    throw new Error('Invalid data URL');
  }
  
  const mimeMatch = arr[0]?.match(/:(.*?);/) ?? null;
  const mime = mimeMatch ? mimeMatch[1] : '';
  const bstr = atob(arr[1] || '');
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
      
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  
  return new File([u8arr], filename, {type:mime});
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};