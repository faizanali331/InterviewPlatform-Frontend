import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type BackLinkProps = {
  to?: string;
  label?: string;
};

export default function BackLink({
  to = "/",
  label = "Back to home",
}: BackLinkProps) {
  return (
    <Link to={to} className="backlink">
      <ArrowLeft size={16} aria-hidden="true" />
      {label}
    </Link>
  );
}
