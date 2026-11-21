const box = { fill: "var(--surface2)", stroke: "var(--line2)", strokeWidth: 1 };
const title = { fill: "var(--text)", fontSize: 13, fontWeight: 700 };
const sub = { fill: "var(--muted)", fontSize: 10 };

function Node({ x, y, w = 120, h = 50, t, s, hi }: { x: number; y: number; w?: number; h?: number; t: string; s?: string; hi?: boolean }) {
  return (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={10} style={hi ? { ...box, stroke: "var(--accent)", strokeWidth: 1.6 } : box} />
    <text x={x + w / 2} y={y + (s ? h / 2 - 3 : h / 2 + 4)} textAnchor="middle" style={title}>
      {t}
    </text>
    {s && (
      <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" style={sub}>
        {s}
      </text>
    )}
  </g>
  );
}

const lbl = { fill: "var(--muted)", fontSize: 10.5, letterSpacing: 0.3 };
const line = { stroke: "var(--muted)", strokeWidth: 1.4 };

/** ONDC request → callback flow, drawn with theme colours. */
export default function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 520 360"
      width="100%"
      role="img"
      aria-label="Architecture: the buyer app sends a request through the Kong gateway into Kafka; the orchestrator consumes it, calls the Unizap microservices for order, catalog, inventory and more, then builds the on_* callback in the ONDC schema and sends it back to the buyer app."
      style={{ display: "block", fontFamily: "var(--font-sans)" }}
    >
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--muted)" }} />
        </marker>
        <marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--accent)" }} />
        </marker>
      </defs>

      <Node x={20} y={30} t="Buyer app" s="BAP" />
      <Node x={200} y={30} t="Kong" s="API gateway" />
      <Node x={380} y={30} t="Kafka" s="event queue" />

      <line x1="140" y1="55" x2="198" y2="55" markerEnd="url(#ah)" style={line} />
      <text x="169" y="47" textAnchor="middle" style={lbl}>request</text>
      <line x1="320" y1="55" x2="378" y2="55" markerEnd="url(#ah)" style={line} />
      <text x="349" y="47" textAnchor="middle" style={lbl}>publish</text>
      <line x1="440" y1="80" x2="440" y2="138" markerEnd="url(#ah)" style={line} />
      <text x="448" y="113" style={lbl}>consume</text>

      <Node x={330} y={140} w={170} h={56} t="Orchestrator" s="fans out, then builds the reply" hi />

      <rect x="190" y="248" width="310" height="96" rx="12" style={{ fill: "none", stroke: "var(--line2)", strokeDasharray: "5 4" }} />
      <text x="202" y="266" style={lbl}>UNIZAP MICROSERVICES</text>
      <text x="488" y="266" textAnchor="end" style={{ ...lbl, fill: "var(--accent)" }}>+ more</text>
      <Node x={202} y={278} w={88} h={46} t="Order" />
      <Node x={301} y={278} w={88} h={46} t="Catalog" />
      <Node x={400} y={278} w={88} h={46} t="Inventory" />

      <line x1="405" y1="196" x2="405" y2="246" markerEnd="url(#ah)" style={line} />
      <line x1="435" y1="246" x2="435" y2="198" markerEnd="url(#ah)" style={line} />
      <text x="398" y="226" textAnchor="end" style={lbl}>call</text>
      <text x="442" y="226" style={lbl}>data</text>

      <path d="M330,168 L80,168 L80,82" markerEnd="url(#aha)" style={{ fill: "none", stroke: "var(--accent)", strokeWidth: 1.8, strokeDasharray: "6 4" }} />
      <text x="205" y="160" textAnchor="middle" style={{ ...lbl, fill: "var(--accent)" }}>on_* callback, in ONDC schema</text>
    </svg>
  );
}
