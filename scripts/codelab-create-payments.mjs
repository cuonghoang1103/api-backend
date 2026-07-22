/**
 * codelab-create-payments.mjs — a dedicated "Payments" group with a professional
 * set of payment-gateway tracks (Vietnam + international). Pure data, idempotent.
 *
 *   node scripts/codelab-create-payments.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

function slugify(t){return t.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[đĐ]/g,'d').toLowerCase().trim()
  .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');}

// General fundamentals skeleton.
const FUND = ['Payment Fundamentals','Payment Flows (Redirect, Hosted, API)','Orders, Amounts & Currency',
  'Webhooks & Async Notifications','Idempotency & Retries','Reconciliation & Ledgers',
  'Refunds, Disputes & Chargebacks','PCI DSS & Security','Fraud Prevention','Multi-Currency & FX',
  'Subscriptions & Recurring Billing','Choosing a Provider'];
// Per-gateway skeleton — includes explicit Sandbox (test) and Production modules.
const GATE = ['Overview & How It Works','Account, Keys & Sandbox Setup','SDK & Server Setup',
  'Creating a Payment / Checkout','Redirect & Return URL Flow','Signature / Hash Verification',
  'Webhooks / IPN Handling','Handling Success, Failure & Timeout','Querying & Reconciling Transactions',
  'Refunds & Cancellations','Testing in Sandbox','Going to Production (Go-Live)',
  'Security & Best Practices','Common Errors & Debugging'];
const levelOf=(i,n)=>i<n/3?'BEGINNER':i<2*n/3?'INTERMEDIATE':'ADVANCED';

// [name, language, color, kind]
const TRACKS = [
  ['Payment Integration Fundamentals','text','#0a2540','FUND'],
  // ── Vietnam / domestic ──
  ['VNPay','typescript','#004a99','GATE'],
  ['PayOS','typescript','#00b3a4','GATE'],
  ['MoMo','typescript','#a50064','GATE'],
  ['ZaloPay','typescript','#0068ff','GATE'],
  ['VietQR & Napas 247','text','#e30613','GATE'],
  ['ShopeePay','typescript','#ee4d2d','GATE'],
  ['OnePay','typescript','#005baa','GATE'],
  // ── International ──
  ['Stripe','typescript','#635bff','GATE'],
  ['PayPal','typescript','#003087','GATE'],
  ['Paddle','typescript','#ffdd00','GATE'],
  ['Lemon Squeezy','typescript','#ffc233','GATE'],
  ['Adyen','typescript','#0abf53','GATE'],
  ['Crypto Payments','typescript','#f7931a','GATE'],
  // ── Batch 2 (more domestic, regional & international) ──
  ['2C2P','typescript','#0060ae','GATE'],
  ['Payoo','typescript','#f47920','GATE'],
  ['Braintree','typescript','#010101','GATE'],
  ['Square','typescript','#3e4348','GATE'],
  ['Razorpay','typescript','#0c2451','GATE'],
  ['Alipay','typescript','#1677ff','GATE'],
  ['WeChat Pay','typescript','#07c160','GATE'],
  ['Apple Pay','typescript','#111111','GATE'],
  ['Google Pay','typescript','#4285f4','GATE'],
  ['Klarna','typescript','#ffb3c7','GATE'],
  ['GrabPay','typescript','#00b14f','GATE'],
  ['Mollie','typescript','#0077ff','GATE'],
];

// Ensure the Payments group exists (after Web & Networking, before FPTU).
let group = await prisma.codeGroup.findUnique({ where: { slug: 'payments' } });
if (!group) {
  console.log('  + group Payments');
  if (APPLY) {
    // push FPTU (and anything at/after it) down so Payments slots in before it.
    await prisma.codeGroup.updateMany({ where: { sortOrder: { gte: 10 } }, data: { sortOrder: { increment: 1 } } });
    group = await prisma.codeGroup.create({ data: {
      name: 'Payments', slug: 'payments',
      description: 'Accept payments professionally — Vietnamese gateways (VNPay, PayOS, MoMo, ZaloPay, VietQR) and international (Stripe, PayPal, Paddle, crypto): sandbox to production, webhooks, refunds, security.',
      icon: 'credit-card', color: '#16a34a', sortOrder: 10,
    }});
  }
}

let tC=0,mC=0,skip=0;
if (group) {
  for (let ti=0; ti<TRACKS.length; ti++) {
    const [name,lang,color,kind] = TRACKS[ti];
    const tslug = slugify(name);
    const exists = await prisma.codeTrack.findUnique({ where: { slug: tslug } });
    if (exists) { console.log(`  = ${tslug}`); skip++; continue; }
    tC++;
    console.log(`  + payments/${tslug} [${lang}] ${kind}`);
    if (APPLY) {
      const track = await prisma.codeTrack.create({ data: {
        groupId: group.id, name, slug: tslug, language: lang, color,
        level: 'BEGINNER', sortOrder: ti, status: 'DRAFT',
        description: `${name} — professional payment track (auto-scaffolded, exercises generating).`,
      }});
      const mods = kind==='FUND'?FUND:GATE;
      for (let i=0;i<mods.length;i++){
        await prisma.codeModule.create({ data: {
          trackId: track.id, name: mods[i], slug: slugify(mods[i]), level: levelOf(i,mods.length), sortOrder: i,
        }});
        mC++;
      }
    }
  }
}
console.log(`\n[payments] group ${group?'ok':'DRY'}, tracks +${tC} (skip ${skip}), modules +${mC}. ${APPLY?'Done.':'DRY.'}`);
await prisma.$disconnect();
