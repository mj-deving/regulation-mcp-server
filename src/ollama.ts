// Thin fetch wrappers over the Ollama HTTP API. No SDK: two endpoints are all this repo needs.

export const ollamaConfig = {
  host: process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434",
  chatModel: process.env.CHAT_MODEL ?? "qwen3:8b",
  embedModel: process.env.EMBED_MODEL ?? "bge-m3",
  think: process.env.THINK === "1",
} as const;

export type ToolCall = { function: { name: string; arguments: Record<string, unknown> } };
export type Message = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: ToolCall[];
  tool_name?: string;
};
export type ToolSpec = {
  type: "function";
  function: { name: string; description?: string; parameters: unknown };
};
export type ChatReply = { content: string; tool_calls?: ToolCall[] };
/** The only thing the agent loop needs from a model. Tests pass scripted implementations. */
export type ChatFn = (messages: Message[], tools: ToolSpec[]) => Promise<ChatReply>;
export type Embedder = (texts: string[]) => Promise<number[][]>;

async function post(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${ollamaConfig.host}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`ollama ${path} ${res.status}: ${await res.text()}`);
  return res.json();
}

export const ollamaEmbed: Embedder = async (texts) => {
  const { embeddings } = (await post("/api/embed", {
    model: ollamaConfig.embedModel,
    input: texts,
  })) as { embeddings: number[][] };
  if (embeddings.length !== texts.length) {
    throw new Error(`embedding count mismatch: ${embeddings.length} for ${texts.length} texts`);
  }
  return embeddings;
};

export const ollamaChat: ChatFn = async (messages, tools) => {
  const { message } = (await post("/api/chat", {
    model: ollamaConfig.chatModel,
    messages,
    tools,
    stream: false,
    think: ollamaConfig.think,
    options: { temperature: 0, num_ctx: 8192 },
  })) as { message: ChatReply };
  return { content: message.content ?? "", tool_calls: message.tool_calls };
};
