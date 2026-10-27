import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function SignupMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node))
        setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lp-menu" ref={wrapRef}>
      <button
        ref={buttonRef}
        className="primary"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Sign up
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {open && (
        <div className="lp-menu-list" role="menu">
          <Link to="/register" role="menuitem" onClick={() => setOpen(false)}>
            I want to practice
            <small>Create a candidate account</small>
          </Link>
          <Link
            to="/register/interviewer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            I want to interview others
            <small>Apply as an interviewer</small>
          </Link>
        </div>
      )}
    </div>
  );
}
