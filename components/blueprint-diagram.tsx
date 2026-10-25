import type { Blueprint } from "@/lib/system-design";

const toneClass: Record<string, string> = {
  client: "is-client",
  edge: "is-edge",
  service: "is-service",
  data: "is-data",
  async: "is-async",
  external: "is-external",
};

export function BlueprintDiagram({
  blueprint,
  compact = false,
}: {
  blueprint: Blueprint;
  compact?: boolean;
}) {
  return (
    <figure className={`blueprint${compact ? " is-compact" : ""}`}>
      <div className="blueprint-layers">
        {blueprint.layers.map((layer, index) => (
          <div className="blueprint-layer" key={layer.label}>
            <div className="blueprint-layer-label">
              <span>{String(index + 1).padStart(2, "0")}</span>
              {layer.label}
            </div>
            <div className="blueprint-nodes">
              {layer.nodes.map((node) => (
                <div
                  className={`blueprint-card ${toneClass[node.tone ?? "service"] ?? "is-service"}`}
                  key={`${layer.label}-${node.label}`}
                >
                  <span className="blueprint-card-label">{node.label}</span>
                  {node.note ? (
                    <span className="blueprint-card-note">{node.note}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption>{blueprint.caption}</figcaption>
    </figure>
  );
}
