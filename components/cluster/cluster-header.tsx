import { Badge } from "@/components/shared/badge";
import type { Cluster } from "@/types/cluster";

type ClusterHeaderProps = {
  cluster: Cluster;
};

export function ClusterHeader({ cluster }: ClusterHeaderProps) {
  return (
    <header className="mb-6">
      <Badge>{cluster.theme}</Badge>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {cluster.title}
      </h1>
      {cluster.subtitle ? (
        <p className="mt-2 text-sm text-zinc-600">{cluster.subtitle}</p>
      ) : null}
    </header>
  );
}
