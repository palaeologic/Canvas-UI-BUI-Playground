// Effort sweep: same prompt, same model, several effort levels. Prints tokens, time and list cost.
//   AWS_BEARER_TOKEN_BEDROCK=... AWS_REGION=eu-north-1 bun run sweep sonnet
// Talks straight to the Bedrock Messages (Mantle) endpoint, so it measures the model rather than a client.

export {};

const MODELS = {
  haiku: { id: "anthropic.claude-haiku-5-5", inPrice: 0.1, outPrice: 0.5 },
  sonnet: { id: "anthropic.claude-sonnet-5-5", inPrice: 2, outPrice: 10 },
  opus: { id: "anthropic.claude-opus-5-5", inPrice: 4, outPrice: 20 },
} as const;
type ModelKey = keyof typeof MODELS;

const key = (Bun.argv[2] ?? "sonnet") as ModelKey;
const model = MODELS[key];
if (!model) {
  console.error(`Unknown model "${key}". Use one of: ${Object.keys(MODELS).join(", ")}`);
  process.exit(1);
}
const token = Bun.env.AWS_BEARER_TOKEN_BEDROCK;
if (!token) {
  console.error("Set AWS_BEARER_TOKEN_BEDROCK to a short-lived Bedrock bearer token first.");
  process.exit(1);
}
const region = Bun.env.AWS_REGION ?? "eu-north-1";
const url = `https://bedrock-mantle.${region}.api.aws/anthropic/v1/messages`;
const levels = (Bun.argv[3] ?? "low,medium,high,xhigh").split(",");

const prompt = `Convert this plate-reader CSV to tidy JSON, one object per well, and flag suspicious wells:
well,sample,od450
A1,blank,0.041
A2,anti-PD-1 10ug/mL,1.873
A3,anti-PD-1 1ug/mL,0.962
B1,isotype ctrl,0.058`;

interface MessagesResponse {
  stop_reason: string;
  usage: { input_tokens: number; output_tokens: number };
  content: { type: string; text?: string }[];
}

console.log(`${model.id} via ${region}\n`);
for (const effort of levels) {
  const t0 = performance.now();
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "anthropic-version": "2023-06-01", "x-api-key": token },
    body: JSON.stringify({
      model: model.id,
      max_tokens: 32_000,
      output_config: { effort },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    console.error(effort.padEnd(7), res.status, await res.text());
    continue;
  }
  const j = (await res.json()) as MessagesResponse;
  const { input_tokens: i, output_tokens: o } = j.usage;
  const secs = ((performance.now() - t0) / 1000).toFixed(1);
  const cost = (i * model.inPrice + o * model.outPrice) / 1e6;
  console.log(
    effort.padEnd(7), `in ${i}`.padEnd(10), `out ${o}`.padEnd(11), `${secs}s`.padEnd(7),
    `$${cost.toFixed(4)} list`, j.stop_reason === "refusal" ? "  REFUSED" : "",
  );
}
