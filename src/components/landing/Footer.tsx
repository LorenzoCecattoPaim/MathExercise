import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xl font-bold">ProvaLab</span>
          </Link>

          {/* Copyright */}
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} ProvaLab. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
