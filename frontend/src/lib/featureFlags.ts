/**
 * Feature flags — commerce visibility switches.
 *
 * WHY: The site is temporarily hiding all e-commerce surfaces (online
 * shop, course payment/checkout, cart, seller info, purchase policies,
 * public contact form) until the business is registered with the
 * Vietnamese Ministry of Industry and Trade (Bộ Công Thương). NOTHING
 * is deleted — every commerce feature stays in the codebase and DB,
 * gated behind these booleans.
 *
 * TO RE-ENABLE later (after MOIT registration): flip the relevant flag
 * from `false` to `true`, rebuild the frontend (`cd frontend && npm run
 * build`) and redeploy. No code changes, no migrations, no data loss —
 * old products, orders and course prices are untouched in the database.
 *
 * These are compile-time constants (not env vars) on purpose: one file,
 * one edit, no VPS/GitHub secret to remember. NEXT_PUBLIC_* env would be
 * baked at build time too, so it buys nothing here.
 */

/** Online shop: /shop pages, product cards, "buy"/"add to cart" buttons. */
export const SHOP_ENABLED = false;

/** Paid course checkout: PayOS/VNPay buttons, price display, discount codes.
 *  When false, courses are FREE-or-ACCESS-CODE only (both kept working). */
export const COURSE_PAYMENT_ENABLED = false;

/** Public contact section on /about (form + email + phone).
 *  Independent from commerce; hidden per the same compliance cleanup. */
export const CONTACT_ENABLED = false;

/** Cart drawer + navbar cart button + /cart /checkout /my-orders routes.
 *  Shown if EITHER commerce path is live (the cart is shared shop⇄academy). */
export const CART_ENABLED = SHOP_ENABLED || COURSE_PAYMENT_ENABLED;

/** Commerce-signalling UI on marketing pages: footer "Thông tin người bán"
 *  (seller name/tax code/address/phone), purchase-policy links, the
 *  e-commerce service tab, and the /shop quick-link. These are exactly the
 *  elements that read as "operating an e-commerce business", so they follow
 *  whether ANY commerce is actually live. */
export const COMMERCE_ENABLED = SHOP_ENABLED || COURSE_PAYMENT_ENABLED;
