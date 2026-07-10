import type { KeyboardEvent } from "react";

export function handleInteractiveKeyDown(
  event: KeyboardEvent,
  onActivate: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onActivate();
  }
}
