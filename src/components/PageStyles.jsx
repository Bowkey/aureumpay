import { useEffect } from "react";

export default function PageStyles({ css }) {
  useEffect(() => {
    const stylesheet = document.createElement("style");
    stylesheet.textContent = css;
    document.head.appendChild(stylesheet);
    return () => stylesheet.remove();
  }, [css]);

  return null;
}
