import React, { memo, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';

const formatValue = (value, fallback) =>
  value === '' ? '' : String(value ?? fallback);

function DraftTextInput({
  value,
  fallback = '',
  onCommit,
  normalizeOnCommit,
  onBlur,
  onFocus,
  onSubmitEditing,
  ...props
}) {
  const focusedRef = useRef(false);
  const [draft, setDraft] = useState(formatValue(value, fallback));

  useEffect(() => {
    if (!focusedRef.current) {
      setDraft(formatValue(value, fallback));
    }
  }, [fallback, value]);

  const commit = () => {
    const nextValue = normalizeOnCommit ? normalizeOnCommit(draft) : draft;
    onCommit?.(nextValue);
    setDraft(formatValue(nextValue, fallback));
  };

  return (
    <TextInput
      {...props}
      value={draft}
      onChangeText={setDraft}
      onFocus={(event) => {
        focusedRef.current = true;
        onFocus?.(event);
      }}
      onBlur={(event) => {
        focusedRef.current = false;
        commit();
        onBlur?.(event);
      }}
      onSubmitEditing={(event) => {
        commit();
        onSubmitEditing?.(event);
      }}
    />
  );
}

export default memo(DraftTextInput);
