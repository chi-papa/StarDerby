export async function getBreedingAdvice(
  gameState,
  selectedMare,
  selectedStallion,
  userMessage
) {
  const prompt = `
    あなたは伝説の馬主であり、ブリーディングのアドバイザーです。
    現在の牧場の状態:
    所持金: ${gameState.money}
    所持牝馬: ${gameState.mares.map(m => m.name).join(", ")}
    
    ユーザーのメッセージ: "${userMessage || "こんにちは"}"
    
    現在の選択状況:
    選択中の牝馬: ${selectedMare ? selectedMare.name : "未選択"}
    選択中の種牡馬: ${selectedStallion ? selectedStallion.name : "未選択"}
    
    アドバイスの指針:
    1. 牝馬が未選択なら、所持している牝馬から選ぶよう促してください。
    2. 牝馬が選択済みで種牡馬が未選択なら、提案を出しつつも「配合の神秘」を強調してください。
    3. インブリード（血統の重なり）については、「何かが起きるかもしれない」といった神秘的な表現を使い、具体的なステータス上昇値やどの文字が効くかといった詳細は伏せてください。
    4. 「流星になろう」というテーマに合わせて、異次元のスピードや伝説の血統について熱く語ってください。
    5. 回答は短く、キャラクター性を持たせてください。
    
    出力は以下のJSON形式で返してください:
    {
      "message": "アドバイザーからのメッセージ",
      "suggestedMareIds": ["m1", "m2"], // 提案する牝馬のID（あれば）
      "suggestedStallionIds": ["s1", "s2"], // 提案する種牡馬のID（あれば）
      "action": "none" | "select_mare" | "select_stallion" | "confirm_breeding"
    }
  `;

  try {
    const response = await fetch('/api/breeding-advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    const text = data.advice;
    
    // JSONを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { message: text, action: "none" };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { message: "通信エラーが発生しました。伝説の血統が乱れています...", action: "none" };
  }
}
