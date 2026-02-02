"use client";

import CryptoJS from "crypto-js";

const APPID = "0b2b6799";
const API_KEY = "NjIzOTIwN2ExYzkwNGFiYThkYjk5YjI2";
const API_SECRET = "5c96cf4d4387d85262435f1f42867518";
const SPARK_URL = "wss://spark-api.xf-yun.com/v3.5/chat";

function getAuthUrl(): string {
  const host = "spark-api.xf-yun.com";
  const date = new Date().toUTCString();
  const algorithm = "hmac-sha256";
  const headers = "host date request-line";
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v3.5/chat HTTP/1.1`;
  const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET);
  const signature = CryptoJS.enc.Base64.stringify(signatureSha);

  const authorizationOrigin = `api_key=${API_KEY}, algorithm=${algorithm}, headers=${headers}, signature=${signature}`;
  const authorization = btoa(authorizationOrigin);

  const url = `${SPARK_URL}?authorization=${encodeURIComponent(
    authorization
  )}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(host)}`;
  return url;
}

export type SparkMessage = {
  role: "user" | "assistant";
  content: string;
};

export type SparkClientOptions = {
  onMessage: (delta: string) => void;
  onClose?: () => void;
  onError?: (e: Event) => void;
};

export function sendSparkChat(
  messages: SparkMessage[],
  { onMessage, onClose, onError }: SparkClientOptions
) {
  const url = getAuthUrl();
  const ws = new WebSocket(url);

  ws.onopen = () => {
    const payload = {
      header: {
        app_id: APPID,
      },
      parameter: {
        chat: {
          domain: "generalv3.5",
          temperature: 0.7,
        },
      },
      payload: {
        message: {
          text: messages.map((m) => ({ role: m.role, content: m.content })),
        },
      },
    };
    ws.send(JSON.stringify(payload));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const choices = data?.payload?.choices?.text || [];
      for (const c of choices) {
        if (c?.content) {
          onMessage(c.content);
        }
      }
      if (data?.header?.status === 2) {
        ws.close();
      }
    } catch (e) {
      console.error("Spark parse error", e);
    }
  };

  ws.onerror = (e) => {
    console.error("Spark ws error", e);
    onError?.(e);
  };

  ws.onclose = () => {
    onClose?.();
  };

  return () => ws.close();
}
