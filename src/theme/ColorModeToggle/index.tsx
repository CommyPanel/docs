import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {Check, Monitor, Moon, MoonStar, Sun} from 'lucide-react';
import type {Props} from '@theme/ColorModeToggle';

/**
 * The panel has three themes (light, dim, dark/true black) and follows the system
 * by default. Docusaurus has light and dark, so "dim" and "dark" are two tones of
 * its dark mode: the tone is `data-tone="black"` on <html> and is remembered in
 * localStorage (also applied before first paint by a script in docusaurus.config.ts).
 */
const TONE_KEY = 'commypanel-docs-tone';

type Choice = 'system' | 'light' | 'dim' | 'dark';

function setTone(black: boolean) {
  try {
    if (black) {
      document.documentElement.setAttribute('data-tone', 'black');
      localStorage.setItem(TONE_KEY, 'black');
    } else {
      document.documentElement.removeAttribute('data-tone');
      localStorage.removeItem(TONE_KEY);
    }
  } catch {
    // Private mode: the choice just is not remembered.
  }
}

function currentTone(): 'dim' | 'black' {
  return typeof document !== 'undefined' && document.documentElement.getAttribute('data-tone') === 'black'
    ? 'black'
    : 'dim';
}

const OPTIONS: {value: Choice; label: string; icon: typeof Sun}[] = [
  {value: 'system', label: 'System', icon: Monitor},
  {value: 'light', label: 'Light', icon: Sun},
  {value: 'dim', label: 'Dim', icon: Moon},
  {value: 'dark', label: 'Dark', icon: MoonStar},
];

export default function ColorModeToggle({className, value, onChange}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [tone, setToneState] = useState<'dim' | 'black'>('dim');
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setToneState(currentTone()), []);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === 'Escape') setOpen(false);
      } else if (root.current && !root.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const current: Choice = value === null ? 'system' : value === 'light' ? 'light' : tone === 'black' ? 'dark' : 'dim';
  const Icon = OPTIONS.find((o) => o.value === current)?.icon ?? Monitor;

  const choose = (choice: Choice) => {
    setOpen(false);
    if (choice === 'system') {
      setTone(false);
      setToneState('dim');
      onChange(null);
    } else if (choice === 'light') {
      setTone(false);
      setToneState('dim');
      onChange('light');
    } else {
      const black = choice === 'dark';
      setTone(black);
      setToneState(black ? 'black' : 'dim');
      onChange('dark');
    }
  };

  return (
    <div className={clsx('cp-theme', className)} ref={root}>
      <button
        type="button"
        className="cp-theme__button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Theme"
        title="Theme"
        onClick={() => setOpen((v) => !v)}>
        <Icon size={20} aria-hidden />
      </button>
      {open && (
        <div className="cp-theme__menu" role="menu" aria-label="Theme">
          {OPTIONS.map(({value: option, label, icon: ItemIcon}) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={current === option}
              className="cp-theme__item"
              onClick={() => choose(option)}>
              <ItemIcon size={18} aria-hidden />
              {label}
              {current === option && <Check size={16} className="cp-theme__check" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
