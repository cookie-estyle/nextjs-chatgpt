// 必要なモジュールをインポートします
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// 応答データの型定義を作成
type ResponseData = {
  text: string;
};

// APIリクエストに送信される body の型定義を作成
interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}

// OpenAI API の設定を作成
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// APIハンドラ関数を定義
export default async function handler(req: GenerateNextApiRequest, res: NextApiResponse<ResponseData>) {
  // リクエストからプロンプトを取得
  const prompt = req.body.prompt;

  // プロンプトが空の場合 400 エラーを返す
  if (!prompt || prompt === '') {
    res.status(400).json({ text: 'Prompt is required' });
    return;
  }

  // OpenAI API にプロンプトを送信して回答を生成
  // https://beta.openai.com/docs/api-reference/completions/create
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'あなたは役立つアシスタントです。' }, { role: 'user', content: prompt }],
    temperature: 0.9,
    max_tokens: 2048,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });

  // 生成された回答を取得
  const response = completion.choices[0].message.content?.trim() || 'Sorry, there was an error.';
  res.status(200).json({ text: response });
}