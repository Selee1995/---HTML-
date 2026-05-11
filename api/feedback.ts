import nodemailer from "nodemailer";

type FeedbackPayload = {
  nickname?: string;
  message?: string;
  source?: string;
  botField?: string;
};

const RECIPIENT_EMAIL = "1278329021@qq.com";
const SMTP_HOST = "smtp.qq.com";
const SMTP_PORT = 465;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function parseBody(body: unknown): FeedbackPayload {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as FeedbackPayload;
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") {
    return body as FeedbackPayload;
  }

  return {};
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "仅支持 POST 请求。" });
  }

  const smtpPass = process.env.QQ_SMTP_PASS;
  if (!smtpPass) {
    return res.status(500).json({
      ok: false,
      error: "邮件服务尚未配置。请补充 QQ 邮箱的 SMTP 授权码后再提交。",
    });
  }

  const payload = parseBody(req.body);
  const botField = normalizeText(payload.botField, 50);
  const nickname = normalizeText(payload.nickname, 80);
  const message = normalizeText(payload.message, 2000);
  const source = normalizeText(payload.source, 120) || "未知来源";

  if (botField) {
    return res.status(200).json({ ok: true });
  }

  if (!message) {
    return res.status(400).json({
      ok: false,
      error: "请先填写建议内容。",
    });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: RECIPIENT_EMAIL,
      pass: smtpPass,
    },
  });

  const sentAt = new Date().toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour12: false,
  });

  const safeNickname = escapeHtml(nickname || "匿名");
  const safeSource = escapeHtml(source);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safeSentAt = escapeHtml(sentAt);

  try {
    const result = await transporter.sendMail({
      from: `汉东人格档案 <${RECIPIENT_EMAIL}>`,
      to: RECIPIENT_EMAIL,
      subject: `汉东人格档案反馈 - ${source}`,
      text: [
        `来源：${source}`,
        `称呼：${nickname || "匿名"}`,
        `时间：${sentAt}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif; line-height: 1.75; color: #111827;">
          <h2 style="margin: 0 0 16px; font-size: 22px;">汉东人格档案反馈</h2>
          <p style="margin: 0 0 8px;"><strong>来源：</strong>${safeSource}</p>
          <p style="margin: 0 0 8px;"><strong>称呼：</strong>${safeNickname}</p>
          <p style="margin: 0 0 8px;"><strong>时间：</strong>${safeSentAt}</p>
          <p style="margin: 16px 0 8px;"><strong>建议内容：</strong></p>
          <div style="white-space: pre-wrap; padding: 16px; border: 1px solid #e5e7eb; background: #fffaf0;">${safeMessage}</div>
        </div>
      `,
    });

    return res.status(200).json({
      ok: true,
      id: result.messageId,
      message: "已发送到 1278329021@qq.com",
    });
  } catch (error) {
    console.error("Feedback email failed:", error);
    return res.status(502).json({
      ok: false,
      error: "邮件发送失败，请稍后再试。",
    });
  }
}
