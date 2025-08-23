import buttonClickSound from './assets/sounds/button-click.mp3';
import correctAnswerSound from './assets/sounds/correct-answer.mp3';
import incorrectAnswerSound from './assets/sounds/incorrect-answer.mp3';
import levelUpSound from './assets/sounds/level-up.mp3';

export type SoundKey = 'button-click' | 'correct-answer' | 'incorrect-answer' | 'level-up';

export const soundMap: Record<SoundKey, string> = {
  'button-click': buttonClickSound,
  'correct-answer': correctAnswerSound,
  'incorrect-answer': incorrectAnswerSound,
  'level-up': levelUpSound,
};
