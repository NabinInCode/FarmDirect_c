import { createHmac, timingSafeEqual } from "node:crypto";

export interface EsewaConfig {
  merchantCode: string;
  secretKey: string;
  testMode: boolean;
}

export function getEsewaConfig(): EsewaConfig {
  return {
    merchantCode: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
    secretKey: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
    testMode: process.env.ESEWA_TEST_MODE !== "false",
  };
}

export function esewaPaymentUrl(testMode: boolean): string {
  return testMode
    ? "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
    : "https://epay.esewa.com.np/api/epay/main/v2/form";
}

function esewaSignature(
  fields: Record<string, string>,
  fieldOrder: string[],
  secretKey: string
): string {
  const message = fieldOrder.map((field) => `${field}=${fields[field]}`).join(",");
  return createHmac("sha256", secretKey).update(message).digest("base64");
}

export interface EsewaPaymentPayload {
  url: string;
  fields: Record<string, string>;
}

export function buildEsewaPayment(opts: {
  totalCents: number;
  transactionUuid: string;
  successUrl: string;
  failureUrl: string;
  config: EsewaConfig;
}): EsewaPaymentPayload {
  const { totalCents, transactionUuid, successUrl, failureUrl, config } = opts;
  const amount = (totalCents / 100).toFixed(2);

  const fields: Record<string, string> = {
    amount,
    tax_amount: "0",
    total_amount: amount,
    transaction_uuid: transactionUuid,
    product_code: config.merchantCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };
  fields.signature = esewaSignature(
    fields,
    ["total_amount", "transaction_uuid", "product_code"],
    config.secretKey
  );

  return { url: esewaPaymentUrl(config.testMode), fields };
}

export interface EsewaCallbackData {
  transaction_code?: string;
  status?: string;
  total_amount?: string;
  transaction_uuid?: string;
  product_code?: string;
  signed_field_names?: string;
  signature?: string;
  [key: string]: string | undefined;
}

export function decodeEsewaCallback(
  dataParam: string,
  config: EsewaConfig
): EsewaCallbackData | null {
  try {
    const payload = JSON.parse(
      Buffer.from(dataParam.replace(/\s+/g, ""), "base64").toString("utf8")
    ) as EsewaCallbackData;

    const fieldOrder = payload.signed_field_names?.split(",") ?? [];
    if (fieldOrder.length === 0 || !payload.signature) return null;

    const expected = esewaSignature(
      payload as Record<string, string>,
      fieldOrder,
      config.secretKey
    );
    const actual = Buffer.from(payload.signature);
    const expectedBuf = Buffer.from(expected);
    if (actual.length !== expectedBuf.length || !timingSafeEqual(actual, expectedBuf)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function checkEsewaTransaction(opts: {
  transactionUuid: string;
  totalAmount: string;
  config: EsewaConfig;
}): Promise<boolean | null> {
  const base = opts.config.testMode
    ? "https://rc-epay.esewa.com.np/api/epay/transaction/status"
    : "https://esewa.com.np/api/epay/transaction/status";
  const url =
    `${base}?product_code=${encodeURIComponent(opts.config.merchantCode)}` +
    `&transaction_uuid=${encodeURIComponent(opts.transactionUuid)}` +
    `&total_amount=${encodeURIComponent(opts.totalAmount)}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const parsed = await res.json().catch(() => null);
    if (!res.ok) return false;
    return parsed?.status === "COMPLETE";
  } catch {
    return null;
  }
}