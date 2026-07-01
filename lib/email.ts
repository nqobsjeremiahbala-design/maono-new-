// Transactional email via Resend (HTTP API — works on Cloudflare Workers).
// No-ops gracefully when RESEND_API_KEY is not set, so it never breaks a flow.
// Required env: RESEND_API_KEY. Optional: EMAIL_FROM (defaults to Resend sandbox).

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://maonoforextrading.co.za'
}
function fromAddress() {
  return process.env.EMAIL_FROM || 'Maono Forex Trading <onboarding@resend.dev>'
}

function replyToAddress() {
  return process.env.EMAIL_REPLY_TO || 'support@maonoforextrading.co.za'
}

// Derive a readable plain-text version from the HTML. A text/plain alternative
// materially improves inbox placement (HTML-only is a spam signal).
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|tr|div|h[1-6]|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function sendEmail(opts: { to: string; subject: string; html: string; text?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${opts.subject}" -> ${opts.to}`)
    return false
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress(),
        to: [opts.to],
        reply_to: replyToAddress(),
        subject: opts.subject,
        html: opts.html,
        text: opts.text ?? htmlToText(opts.html),
      }),
    })
    if (!res.ok) console.error('[email] resend error', res.status, await res.text().catch(() => ''))
    return res.ok
  } catch (e) {
    console.error('[email] send failed', e)
    return false
  }
}

// ─── Shared branded layout ────────────────────────────────────────────────
function layout(opts: { heading: string; body: string; cta?: { label: string; href: string }; preheader?: string }) {
  const { heading, body, cta, preheader } = opts
  return `<!doctype html><html><body style="margin:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0d1426;border:1px solid #1a2d50;border-radius:16px;overflow:hidden">
        <tr><td align="center" style="background:#ffffff;padding:24px 32px">
          <img src="${appUrl()}/images/logo/maono_forex_trading_logo_transparent_light_site.png" alt="Maono Forex Trading" width="156" style="display:inline-block;width:156px;max-width:55%;height:auto;border:0;outline:none;text-decoration:none" />
        </td></tr>
        <tr><td style="padding:8px 32px 4px">
          <h1 style="color:#ffffff;font-size:22px;line-height:1.25;margin:0 0 12px">${heading}</h1>
          <div style="color:#b4c2dc;font-size:15px;line-height:1.6">${body}</div>
        </td></tr>
        ${cta ? `<tr><td style="padding:20px 32px 8px"><a href="${cta.href}" style="display:inline-block;background:#c9a84c;color:#0a0f1e;font-weight:700;font-size:15px;text-decoration:none;padding:12px 24px;border-radius:10px">${cta.label}</a></td></tr>` : ''}
        <tr><td style="padding:24px 32px 28px;border-top:1px solid #14223c;margin-top:16px">
          <p style="color:#56607a;font-size:12px;line-height:1.6;margin:16px 0 0">
            Maono Forex Trading · ${appUrl().replace(/^https?:\/\//, '')}<br/>
            You're receiving this because you have an account with us.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`
}

// ─── 1. Welcome / first registration ──────────────────────────────────────
export function sendWelcomeEmail(to: string, name?: string | null) {
  return sendEmail({
    to,
    subject: 'Welcome to Maono Forex Trading',
    html: layout({
      preheader: 'Your account is ready — start learning.',
      heading: `Welcome${name ? `, ${name.split(' ')[0]}` : ''} 👋`,
      body: `<p>Your Maono account is ready. You now have access to our structured forex courses and the Telegram community.</p><p>Browse the bundles to unlock the full curriculum — pay once, learn forever.</p>`,
      cta: { label: 'Go to your dashboard', href: `${appUrl()}/dashboard` },
    }),
  })
}

// ─── 2. Purchase successful (single course / path) ────────────────────────
export function sendPurchaseEmail(to: string, itemLabel: string) {
  return sendEmail({
    to,
    subject: `Purchase confirmed: ${itemLabel}`,
    html: layout({
      preheader: `You now have access to ${itemLabel}.`,
      heading: 'Purchase successful 🎉',
      body: `<p>Thanks for your purchase. You now have lifetime access to <strong style="color:#fff">${itemLabel}</strong>.</p><p>Jump in from your dashboard — your progress saves automatically.</p>`,
      cta: { label: 'Start learning', href: `${appUrl()}/dashboard` },
    }),
  })
}

// ─── 3. Plan upgrade (bundle) ─────────────────────────────────────────────
export function sendUpgradeEmail(to: string, planName: string) {
  return sendEmail({
    to,
    subject: `You're now on the ${planName}`,
    html: layout({
      preheader: `Your ${planName} is active.`,
      heading: `Welcome to the ${planName} 🚀`,
      body: `<p>Your plan upgrade is complete. The courses in your <strong style="color:#fff">${planName}</strong> are unlocked with lifetime access.</p>`,
      cta: { label: 'Open your dashboard', href: `${appUrl()}/dashboard` },
    }),
  })
}

// ─── 4. Payment / deposit failed ──────────────────────────────────────────
export function sendPaymentFailedEmail(to: string, itemLabel: string) {
  return sendEmail({
    to,
    subject: 'Your payment didn’t go through',
    html: layout({
      preheader: `We couldn't process your payment for ${itemLabel}.`,
      heading: 'Payment unsuccessful',
      body: `<p>We weren’t able to process your payment for <strong style="color:#fff">${itemLabel}</strong>. No money has been taken.</p><p>You can try again from the checkout — if it keeps failing, reply to this email and we’ll sort it out.</p>`,
      cta: { label: 'Try again', href: `${appUrl()}/memberships` },
    }),
  })
}

// ─── Netcash transactional emails (success / pending / failed) ─────────────
const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || 'https://t.me/MaonoForexTrading1'

const telegramLine = `<p style="margin-top:18px">Questions? Reply to this email or join our community: <a href="${TELEGRAM_URL}" style="color:#c9a84c">Maono Forex Trading on Telegram</a>.</p>`

export function sendNetcashSuccessEmail(to: string, tierName: string, courseTitles: string[]) {
  const list = courseTitles.length
    ? `<ul style="margin:8px 0 0;padding-left:18px">${courseTitles.map((t) => `<li style="margin:2px 0">${t}</li>`).join('')}</ul>`
    : ''
  return sendEmail({
    to,
    subject: `Payment confirmed — your ${tierName} plan is active`,
    html: layout({
      preheader: `Your ${tierName} plan is active.`,
      heading: 'Payment successful 🎉',
      body: `<p>Thank you — your payment is confirmed and your <strong style="color:#fff">${tierName}</strong> plan is now active with lifetime access to:</p>${list}<p style="margin-top:12px">Jump in from your dashboard; your progress saves automatically.</p>${telegramLine}`,
      cta: { label: 'Go to my courses', href: `${appUrl()}/my-courses` },
    }),
  })
}

export function sendNetcashPendingEmail(to: string, tierName: string) {
  return sendEmail({
    to,
    subject: `We’re confirming your ${tierName} payment`,
    html: layout({
      preheader: 'Your payment is being confirmed.',
      heading: 'Payment pending',
      body: `<p>Thanks — we’ve received your order for the <strong style="color:#fff">${tierName}</strong> plan and it’s being confirmed. Some methods (EFT, retail) can take a little while.</p><p>As soon as the payment clears we’ll unlock your courses and email you again. No action needed.</p>${telegramLine}`,
      cta: { label: 'View my dashboard', href: `${appUrl()}/dashboard` },
    }),
  })
}

export function sendNetcashFailedEmail(to: string, tierName: string) {
  return sendEmail({
    to,
    subject: 'Your payment didn’t go through',
    html: layout({
      preheader: `We couldn't process your ${tierName} payment.`,
      heading: 'Payment unsuccessful',
      body: `<p>We weren’t able to process your payment for the <strong style="color:#fff">${tierName}</strong> plan. No money has been taken.</p><p>You can try again from the checkout — if it keeps failing, reply to this email and we’ll help.</p>${telegramLine}`,
      cta: { label: 'Try again', href: `${appUrl()}/memberships` },
    }),
  })
}

// ─── 5. Password reset ────────────────────────────────────────────────────
export function sendPasswordResetEmail(to: string, resetUrl: string) {
  return sendEmail({
    to,
    subject: 'Reset your Maono password',
    html: layout({
      preheader: 'Reset your password — link valid for 1 hour.',
      heading: 'Reset your password',
      body: `<p>We received a request to reset your password. Click the button below to choose a new one. This link is valid for <strong style="color:#fff">1 hour</strong>.</p><p>If you didn’t request this, you can safely ignore this email.</p>`,
      cta: { label: 'Reset password', href: resetUrl },
    }),
  })
}

// ─── 6b. Email verification (new self-signups) ────────────────────────────
export function sendVerificationEmail(to: string, verifyUrl: string) {
  return sendEmail({
    to,
    subject: 'Confirm your email — Maono Forex Trading',
    html: layout({
      preheader: 'Confirm your email to activate your account.',
      heading: 'Confirm your email',
      body: `<p>Thanks for signing up. Please confirm your email address to activate your account — you'll be able to log in once it's confirmed. This link is valid for <strong style="color:#fff">24 hours</strong>.</p><p>If you didn't create this account, you can safely ignore this email.</p>`,
      cta: { label: 'Confirm my email', href: verifyUrl },
    }),
  })
}

// ─── 8. Welcome-back / reactivation (bulk to existing migrated clients) ────
// Personalised per user (first name + their plan). Single clear CTA + a reset
// fallback, since most returning members won't remember their old password.

// Greet by first name only when it looks like a real given name — migrated
// WordPress "names" are often usernames (jwessels, Deoni.Olivier, Jamyadams95).
function friendlyFirstName(name?: string | null): string {
  const first = (name ?? '').trim().split(/\s+/)[0] ?? ''
  return /^[A-Z][a-zA-Z'’-]{1,}$/.test(first) ? first : ''
}

export function welcomeBackEmailHtml(to: string, name: string | null | undefined, planName: string): string {
  const first = friendlyFirstName(name)
  const loginUrl = `${appUrl()}/login`
  const resetUrl = `${appUrl()}/forgot-password`
  return layout({
      preheader: `We've rebuilt Maono Forex Trading. Here's how to log back in and pick up your ${planName} courses.`,
      heading: `Welcome back${first ? `, ${first}` : ''} 👋`,
      body: `
        <p>Maono Forex Trading has a <strong style="color:#fff">brand-new home</strong> — faster, cleaner and built around how you actually learn to trade.</p>
        <p>Your account came with us. You still have <strong style="color:#fff">lifetime access to your ${planName} plan</strong> — every course, ready when you are.</p>
        <p style="margin:22px 0 10px;color:#ffffff;font-weight:600">Getting back in takes under a minute:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.55;color:#b4c2dc">
          <tr><td valign="top" style="padding:0 12px 12px 0;width:26px"><span style="display:inline-block;width:24px;height:24px;background:#c9a84c;color:#0a0f1e;border-radius:12px;text-align:center;font-weight:700;font-size:13px;line-height:24px">1</span></td><td style="padding:0 0 12px"><strong style="color:#fff">Open the new site</strong> — tap the gold button below.</td></tr>
          <tr><td valign="top" style="padding:0 12px 12px 0"><span style="display:inline-block;width:24px;height:24px;background:#c9a84c;color:#0a0f1e;border-radius:12px;text-align:center;font-weight:700;font-size:13px;line-height:24px">2</span></td><td style="padding:0 0 12px"><strong style="color:#fff">Sign in</strong> with this email address (<span style="color:#fff">${to}</span>). Can't remember your password? Tap <strong style="color:#fff">"Forgot password"</strong> and we'll email you a reset link.</td></tr>
          <tr><td valign="top" style="padding:0 12px 0 0"><span style="display:inline-block;width:24px;height:24px;background:#c9a84c;color:#0a0f1e;border-radius:12px;text-align:center;font-weight:700;font-size:13px;line-height:24px">3</span></td><td><strong style="color:#fff">Open your Dashboard</strong> — your ${planName} courses are waiting.</td></tr>
        </table>
        <p style="margin-top:18px">First time back on the new site? Most returning members just <a href="${resetUrl}" style="color:#c9a84c">reset their password here</a> — it takes about 30 seconds.</p>
        ${telegramLine}
      `,
      cta: { label: 'Log in to my dashboard', href: loginUrl },
  })
}

export function sendWelcomeBackEmail(to: string, name: string | null | undefined, planName: string) {
  const first = friendlyFirstName(name)
  const subject = first
    ? `Welcome back, ${first} — your ${planName} courses are ready`
    : `Welcome back — your ${planName} courses are ready`
  return sendEmail({ to, subject, html: welcomeBackEmailHtml(to, name, planName) })
}

// ─── 6. Account invite (admin-provisioned client sets their password) ──────
export function sendClientInviteEmail(to: string, name: string | null | undefined, setupUrl: string) {
  return sendEmail({
    to,
    subject: 'Your Maono Forex Trading account is ready',
    html: layout({
      preheader: 'Set your password to access your courses.',
      heading: `Welcome${name ? `, ${name.split(' ')[0]}` : ''} 👋`,
      body: `<p>An account has been created for you at Maono Forex Trading and your courses are unlocked. To get in, set your password using the button below, then sign in with this email address.</p><p>This link is valid for <strong style="color:#fff">7 days</strong>. If it expires, use “Forgot password” on the login page.</p>`,
      cta: { label: 'Set your password', href: setupUrl },
    }),
  })
}
