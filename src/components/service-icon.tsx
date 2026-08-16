import { Globe, Zap, ShoppingCart, PenTool, Rocket, Wrench } from "lucide-react";
import type { ServiceIcon as ServiceIconKey } from "@/lib/admin-store";

const map = {
  globe: Globe,
  zap: Zap,
  cart: ShoppingCart,
  pen: PenTool,
  rocket: Rocket,
  wrench: Wrench,
} as const;

export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceIconKey;
  className?: string;
}) {
  const Icon = map[name] ?? Globe;
  return <Icon className={className} aria-hidden="true" />;
}
