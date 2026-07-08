/* @ds-bundle: {"format":4,"namespace":"MinimalDS_bd53f0","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"StatusTag","sourcePath":"components/core/StatusTag.jsx"}],"sourceHashes":{"components/core/Button.jsx":"147e0692e74d","components/core/Card.jsx":"0f8fc96edce0","components/core/Input.jsx":"69e90fa7d02a","components/core/ProgressBar.jsx":"cc9d02be14d0","components/core/StatusTag.jsx":"0739c629becd"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MinimalDS_bd53f0 = window.MinimalDS_bd53f0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--weight-medium)',
    lineHeight: 'var(--leading-tight)',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 120ms, box-shadow 120ms, border-color 120ms, color 120ms',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap'
  };
  const sizes = {
    sm: {
      fontSize: 'var(--text-sm)',
      padding: 'var(--pad-btn-sm)'
    },
    md: {
      fontSize: 'var(--text-base)',
      padding: 'var(--pad-btn-md)'
    },
    lg: {
      fontSize: 'var(--text-md)',
      padding: 'var(--pad-btn-lg)'
    }
  };
  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: 'var(--color-text-inverse)',
      borderColor: 'var(--color-primary)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-muted)',
      borderColor: 'transparent'
    }
  };
  const [hovered, setHovered] = React.useState(false);
  const hoverVariants = {
    primary: {
      background: 'var(--color-primary-hover)',
      borderColor: 'var(--color-primary-hover)'
    },
    secondary: {
      background: 'var(--color-primary-light)',
      borderColor: 'var(--color-primary)'
    },
    ghost: {
      background: 'var(--color-border-light)',
      color: 'var(--color-text)'
    }
  };
  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(hovered && !disabled ? hoverVariants[variant] : {})
  };
  return React.createElement('button', {
    style,
    disabled,
    onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: e => {
      e.target.style.boxShadow = 'var(--ring-focus)';
    },
    onBlur: e => {
      e.target.style.boxShadow = 'none';
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  padding = 'md',
  shadow = 'sm',
  radius = 'lg',
  border = true,
  children,
  style: extraStyle
}) {
  const padMap = {
    sm: '16px',
    md: '24px',
    lg: '32px'
  };
  const shadowMap = {
    none: 'none',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)'
  };
  const style = {
    fontFamily: 'var(--font-sans)',
    background: 'var(--color-surface)',
    borderRadius: radius === 'lg' ? 'var(--radius-lg)' : radius === 'md' ? 'var(--radius-md)' : 'var(--radius-sm)',
    padding: padMap[padding] || padding,
    boxShadow: shadowMap[shadow] || shadow,
    border: border ? '1px solid var(--color-border)' : 'none',
    ...extraStyle
  };
  return React.createElement('div', {
    style
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  label,
  placeholder = '',
  value,
  onChange,
  type = 'text',
  hint,
  error,
  disabled = false,
  prefix,
  suffix
}) {
  const [focused, setFocused] = React.useState(false);
  const wrapStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontFamily: 'var(--font-sans)'
  };
  const labelStyle = {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--weight-medium)',
    color: 'var(--color-text)',
    lineHeight: 'var(--leading-tight)'
  };
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: disabled ? 'var(--color-border-light)' : 'var(--color-surface)',
    border: `1.5px solid ${error ? 'var(--color-error)' : focused ? 'var(--color-border-focus)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: 'var(--pad-input)',
    boxShadow: focused && !error ? 'var(--ring-focus)' : 'none',
    transition: 'border-color 120ms, box-shadow 120ms'
  };
  const inputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 'var(--text-base)',
    color: disabled ? 'var(--color-text-muted)' : 'var(--color-text)',
    fontFamily: 'var(--font-sans)',
    cursor: disabled ? 'not-allowed' : 'text'
  };
  const adornStyle = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    flexShrink: 0
  };
  const hintStyle = {
    fontSize: 'var(--text-xs)',
    color: error ? 'var(--color-error)' : 'var(--color-text-muted)',
    lineHeight: 'var(--leading-normal)'
  };
  return React.createElement('div', {
    style: wrapStyle
  }, label && React.createElement('label', {
    style: labelStyle
  }, label), React.createElement('div', {
    style: rowStyle
  }, prefix && React.createElement('span', {
    style: adornStyle
  }, prefix), React.createElement('input', {
    type,
    value,
    placeholder,
    disabled,
    style: inputStyle,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }), suffix && React.createElement('span', {
    style: adornStyle
  }, suffix)), (hint || error) && React.createElement('span', {
    style: hintStyle
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  color,
  showLabel = false,
  label
}) {
  const pct = Math.min(100, Math.max(0, value / max * 100));
  const heights = {
    sm: '4px',
    md: '8px',
    lg: '12px'
  };
  const trackStyle = {
    width: '100%',
    height: heights[size] || heights.md,
    background: 'var(--color-border)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    fontFamily: 'var(--font-sans)'
  };
  const fillStyle = {
    height: '100%',
    width: `${pct}%`,
    background: color || 'var(--color-primary)',
    borderRadius: 'var(--radius-full)',
    transition: 'width 400ms cubic-bezier(.4,0,.2,1)'
  };
  const wrapStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontFamily: 'var(--font-sans)'
  };
  const topRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)'
  };
  const bar = React.createElement('div', {
    style: trackStyle,
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': 0,
    'aria-valuemax': max
  }, React.createElement('div', {
    style: fillStyle
  }));
  if (!showLabel && !label) return bar;
  return React.createElement('div', {
    style: wrapStyle
  }, (label || showLabel) && React.createElement('div', {
    style: topRowStyle
  }, label && React.createElement('span', null, label), showLabel && React.createElement('span', null, `${Math.round(pct)}%`)), bar);
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusTag.jsx
try { (() => {
function StatusTag({
  status = 'pending',
  label
}) {
  const config = {
    success: {
      bg: 'var(--color-success-light)',
      color: 'var(--color-success)',
      dot: '#16A34A',
      text: label || 'Bajarildi'
    },
    pending: {
      bg: 'var(--color-warning-light)',
      color: '#92400E',
      dot: '#F59E0B',
      text: label || 'Kutilmoqda'
    },
    error: {
      bg: 'var(--color-error-light)',
      color: 'var(--color-error)',
      dot: '#DC2626',
      text: label || 'Xatolik'
    },
    info: {
      bg: 'var(--color-info-light)',
      color: '#0369A1',
      dot: '#0EA5E9',
      text: label || 'Ma\'lumot'
    },
    draft: {
      bg: 'var(--color-border-light)',
      color: 'var(--color-text-muted)',
      dot: '#94A3B8',
      text: label || 'Qoralama'
    }
  };
  const c = config[status] || config.pending;
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    background: c.bg,
    color: c.color,
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-semibold)',
    fontFamily: 'var(--font-sans)',
    letterSpacing: 'var(--tracking-wide)',
    lineHeight: 'var(--leading-tight)',
    whiteSpace: 'nowrap'
  };
  const dotStyle = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: c.dot,
    flexShrink: 0
  };
  return React.createElement('span', {
    style
  }, React.createElement('span', {
    style: dotStyle
  }), c.text);
}
Object.assign(__ds_scope, { StatusTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusTag.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatusTag = __ds_scope.StatusTag;

})();
