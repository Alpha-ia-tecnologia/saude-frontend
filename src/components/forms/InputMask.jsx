import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const masks = {
  cpf: (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
  cnpj: (value) => value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2'),
  phone: (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) return numbers.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    return numbers.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  },
  cep: (value) => value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2'),
  date: (value) => value.replace(/\D/g, '').slice(0, 8).replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2'),
  cns: (value) => value.replace(/\D/g, '').slice(0, 15),
  currency: (value) => {
    const numbers = value.replace(/\D/g, '');
    const amount = (parseInt(numbers || '0') / 100).toFixed(2);
    return `R$ ${amount.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }
};

export function InputMask({ mask, value = '', onChange, placeholder, className = '', ...props }) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(masks[mask] ? masks[mask](value) : value);
    }
  }, [value, mask]);

  const handleChange = useCallback((e) => {
    const rawValue = e.target.value;
    const maskedValue = masks[mask] ? masks[mask](rawValue) : rawValue;
    setInternalValue(maskedValue);
    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: maskedValue, rawValue: rawValue.replace(/\D/g, '') } });
    }
  }, [mask, onChange]);

  return (
    <input
      type="text"
      className={cn(
        'h-10 w-full rounded-lg border border-input bg-white px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
        className
      )}
      value={internalValue}
      onChange={handleChange}
      placeholder={placeholder}
      {...props}
    />
  );
}

export default InputMask;
