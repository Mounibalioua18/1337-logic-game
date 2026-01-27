
import { CommandInstance, ActionType } from '../types';

export class CodeParser {
  static tokenize(code: string): string[] {
    // Regex to capture keywords, function calls, and if-blocks
    // Simplified: we want F, R, L, F0-F5, if, blue, {, }
    const regex = /(if|blue|\{|\}|F\d|F|R|L|A|D|G|avancer|droite|gauche)/gi;
    return (code.match(regex) || []).map(t => t.toUpperCase());
  }

  // Updated to return CommandInstance[] and handle flat command structure
  static parse(tokens: string[]): CommandInstance[] {
    const commands: CommandInstance[] = [];
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];

      if (token === 'IF') {
        // Look for 'BLUE' and '{'
        if (tokens[i + 1] === 'BLUE' && tokens[i + 2] === '{') {
          let braceCount = 1;
          let subTokens: string[] = [];
          i += 3;
          while (i < tokens.length && braceCount > 0) {
            if (tokens[i] === '{') braceCount++;
            if (tokens[i] === '}') braceCount--;
            if (braceCount > 0) subTokens.push(tokens[i]);
            i++;
          }
          // Recursively parse sub-tokens and apply the 'BLUE' condition to each resulting command
          const subCommands = CodeParser.parse(subTokens);
          subCommands.forEach(cmd => {
            // Fix: Use 'BLUE' instead of 'B' to match ConditionType
            cmd.condition = 'BLUE';
          });
          commands.push(...subCommands);
          continue; // i is already incremented
        }
      } else if (token.startsWith('F') && token.length > 1) {
        // Function call (e.g., F1, F2)
        // Fix: Cast token to ActionType and provide missing condition: null
        commands.push({ action: token as ActionType, condition: null });
      } else if (['F', 'R', 'L', 'A', 'D', 'G', 'AVANCER', 'DROITE', 'GAUCHE'].includes(token)) {
        // Map French/Old commands to standard internal representation
        let val: ActionType;
        if (token === 'A' || token === 'F' || token === 'AVANCER') val = 'FORWARD';
        else if (token === 'D' || token === 'R' || token === 'DROITE') val = 'RIGHT';
        else if (token === 'G' || token === 'L' || token === 'GAUCHE') val = 'LEFT';
        else {
          i++;
          continue;
        }
        // Fix: Provide missing condition: null and ensure val is typed as ActionType
        commands.push({ action: val, condition: null });
      }
      i++;
    }

    return commands;
  }
}
