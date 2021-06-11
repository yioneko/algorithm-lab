import { useState } from "react";

export function useToggle(initialValue: boolean): [boolean, (newValue?: boolean) => void] {
  const [state, setState] = useState(initialValue);
  return [
    state,
    (newValue?: boolean) => setState((prev) => (newValue !== undefined ? newValue : !prev)),
  ];
}
