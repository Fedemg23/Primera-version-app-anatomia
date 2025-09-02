export type SoundKey = 'button-click' | 'correct-answer' | 'incorrect-answer' | 'level-up';

export const soundMap: Record<SoundKey, string> = {
  'button-click': '/sounds/button-click.mp3',
  'correct-answer': '/sounds/correct-answer.mp3',
  'incorrect-answer': '/sounds/incorrect-answer.mp3',
  'level-up': '/sounds/level-up.mp3',
};
