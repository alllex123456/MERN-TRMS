export const quantity = (subject) =>
  subject.unit === '2000cw/s'
    ? 'caractere cu spatii'
    : subject.unit === 'word'
    ? 'cuvinte'
    : subject.unit === '300w'
    ? 'cuvinte'
    : 'caractere fara spatii';
