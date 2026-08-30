/**
 * Commerce configuration.
 *
 * The site is a static export with no server, so there is nowhere to run
 * Stripe's server SDK, create a Checkout Session, or receive a webhook. The
 * approach that actually fits is a **Stripe Payment Link**: Stripe hosts the
 * entire checkout, handles cards, wallets, receipts and PCI scope, and the site
 * only ever needs to link to it.
 *
 * Everything here is read from the environment, so no keys or URLs are hardcoded
 * and nothing secret is involved — a Payment Link URL is public by design.
 */

/** e.g. https://buy.stripe.com/xxxxxxxx — from the Stripe Dashboard. */
export const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_LINK ?? "";

/** Displayed price. Must match the Payment Link's price in Stripe. */
export const PRICE = process.env.NEXT_PUBLIC_PRICE ?? "$97";

export const PAYMENTS_LIVE = STRIPE_LINK.length > 0;

/**
 * A short, opaque order reference.
 *
 * Appended to the Payment Link as `client_reference_id`, which Stripe shows on
 * the payment and includes in the `checkout.session.completed` event. The same
 * code goes into the emailed story, which is what lets a payment be matched to
 * the right pet without any backend.
 *
 * Stripe restricts this to alphanumerics, dashes and underscores, so the
 * alphabet below is deliberately narrow — and it also omits I, L, O and U so a
 * code can be read down the phone without ambiguity.
 *
 * Opaque on purpose: Stripe's own guidance is not to put anything sensitive in
 * this parameter, since links can end up in unexpected places.
 */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function makeRef(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `TWR-${body}`;
}

/** Payment Link with the reference attached. */
export function checkoutUrl(ref: string): string {
  if (!STRIPE_LINK) return "";
  const sep = STRIPE_LINK.includes("?") ? "&" : "?";
  return `${STRIPE_LINK}${sep}client_reference_id=${encodeURIComponent(ref)}`;
}
