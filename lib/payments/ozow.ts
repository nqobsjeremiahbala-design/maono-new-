/**
 * Ozow Payment Gateway — integration layer
 *
 * Ozow is a South African payment provider supporting:
 * - Instant EFT (primary — most SA users prefer this)
 * - Card payments (Visa/Mastercard via 3DS)
 *
 * Flow:
 * 1. Server creates a payment request → redirects user to Ozow hosted page
 * 2. User completes payment on Ozow
 * 3. Ozow sends a POST webhook to /api/webhooks/ozow with result
 * 4. We verify the hash, update Purchase status, and grant enrollment
 *
 * Docs: https://docs.ozow.com
 *
 * Environment variables required:
 *   OZOW_SITE_CODE, OZOW_PRIVATE_KEY, OZOW_API_KEY, OZOW_IS_TEST
 */

import crypto from 'crypto'

// ─── Config ──────────────────────────────────────────────────

function getConfig() {
  const siteCode = process.env.OZOW_SITE_CODE
  const privateKey = process.env.OZOW_PRIVATE_KEY
  const apiKey = process.env.OZOW_API_KEY
  const isTest = process.env.OZOW_IS_TEST === 'true'

  if (!siteCode || !privateKey) {
    throw new Error('Ozow environment variables not configured. See .env.example')
  }

  return { siteCode, privateKey, apiKey, isTest }
}

const OZOW_PAY_URL_TEST = 'https://pay.ozow.com'
const OZOW_PAY_URL_LIVE = 'https://pay.ozow.com'

// ─── Types ───────────────────────────────────────────────────

export type OzowPaymentRequest = {
  /** Internal reference for this transaction (Purchase.id) */
  transactionReference: string
  /** Amount in ZAR (not cents — Ozow uses decimal rands) */
  amount: number
  /** Customer email for Ozow receipt */
  customerEmail?: string
  /** What the customer sees on the Ozow page */
  description: string
}

export type OzowWebhookPayload = {
  SiteCode: string
  TransactionId: string
  TransactionReference: string
  Amount: string
  Status: 'Complete' | 'Cancelled' | 'Error' | 'Abandoned' | 'PendingInvestigation'
  StatusMessage: string
  CurrencyCode: string
  IsTest: string
  Hash: string
}

// ─── Create payment redirect URL ─────────────────────────────

export function buildOzowPaymentUrl(req: OzowPaymentRequest): string {
  const config = getConfig()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const params: Record<string, string> = {
    SiteCode: config.siteCode,
    CountryCode: 'ZA',
    CurrencyCode: 'ZAR',
    Amount: req.amount.toFixed(2),
    TransactionReference: req.transactionReference,
    BankReference: req.description.slice(0, 20),
    Optional1: req.customerEmail || '',
    CancelUrl: `${appUrl}/checkout?status=cancelled`,
    ErrorUrl: `${appUrl}/checkout?status=error`,
    SuccessUrl: `${appUrl}/checkout?status=success&ref=${req.transactionReference}`,
    NotifyUrl: `${appUrl}/api/webhooks/ozow`,
    IsTest: config.isTest ? 'true' : 'false',
  }

  // Ozow requires a SHA-512 hash of concatenated values + private key
  const hashInput = [
    params.SiteCode,
    params.CountryCode,
    params.CurrencyCode,
    params.Amount,
    params.TransactionReference,
    params.BankReference,
    params.Optional1,
    params.CancelUrl,
    params.ErrorUrl,
    params.SuccessUrl,
    params.NotifyUrl,
    params.IsTest,
    config.privateKey,
  ]
    .join('')
    .toLowerCase()

  params.HashCheck = crypto.createHash('sha512').update(hashInput).digest('hex')

  const url = new URL(config.isTest ? OZOW_PAY_URL_TEST : OZOW_PAY_URL_LIVE)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }

  return url.toString()
}

// ─── Verify webhook hash ─────────────────────────────────────

export function verifyOzowWebhook(payload: OzowWebhookPayload): boolean {
  const config = getConfig()

  // Ozow hash: SHA-512 of specific fields concatenated + private key (lowercased)
  const hashInput = [
    payload.SiteCode,
    payload.TransactionId,
    payload.TransactionReference,
    payload.Amount,
    payload.Status,
    payload.CurrencyCode,
    payload.IsTest,
    payload.StatusMessage,
    config.privateKey,
  ]
    .join('')
    .toLowerCase()

  const expected = crypto.createHash('sha512').update(hashInput).digest('hex')
  return expected === payload.Hash.toLowerCase()
}

// ─── Map Ozow status to our PaymentStatus enum ──────────────

export function mapOzowStatus(ozowStatus: string): 'COMPLETE' | 'CANCELLED' | 'ERROR' | 'PENDING' {
  switch (ozowStatus) {
    case 'Complete':
      return 'COMPLETE'
    case 'Cancelled':
    case 'Abandoned':
      return 'CANCELLED'
    case 'Error':
    case 'PendingInvestigation':
      return 'ERROR'
    default:
      return 'PENDING'
  }
}
