/**
 * Fixed paper-grain overlay.
 *
 * The highest-value detail in the whole design system: it breaks up flat
 * colour fills the way real ink on real paper does, and it's the single
 * fastest way to stop a site reading as machine-generated.
 */
export default function Grain() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
