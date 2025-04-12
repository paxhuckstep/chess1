# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
////////////////////////////////////////////////////////////////////////////////////////////

This is a personal project to challenge my skills and help me grow as a developer.
The goal is simple: create a fully functional chess board on my own.
Sub-goal: rely minimally on AI to develop my programming skills independently.

Going into this project, I knew there would be many technical challenges ahead - some I anticipated would be difficult, some proved harder than expected, and others were surprisingly straightforward.

The Knight's Movement
The knight piece was definitely easier than expected to implement. Although it's often the most confusing piece for new chess players, it was the simplest to code. Its possible moves are consistent, and once I created the "handlePossibleLegalKnightMoves" function, the rest fell into place naturally.

Piece Movement and Obstacles
Checking obstacles for the knight simply involves ensuring it doesn't land on friendly pieces. This logic, implemented in "handleKnightObstacles", became reusable across all pieces. While I could rename it to "handleDontMoveOnSameColor" for better readability, I prefer the current name. It complements how "handlePossibleLegalQueenMoves" combines "handlePossibleLegalBishopMoves" and "handlePossibleLegalRookMoves".

The Bishop Challenge
The bishop proved surprisingly challenging to code. Initially, checking diagonals wasn't intuitive - you can see my first approach in "handlePossibleLegalBishopMoves". The AI later suggested a clever solution in "isSquareSeen: isDiagonalAttack", which I adopted for subsequent diagonal calculations while keeping my original solution to showcase my problem-solving approach. After figuring out "handleRookObstacles", adapting it for the bishop became more manageable.

The Rook and Queen Implementation
"handleRookObstacles" contains some redundant code that doesn't affect rook movement. This was intentional to allow "handleQueenObstacles" to simply call both "handleBishopObstacles" and "handleRookObstacles" without issues - a small but interesting optimization.

Pinned Pieces Logic
"handleIsPinnedToKing" required significant strategic thinking. The main challenge was that pinned pieces can still move within certain constraints - they just can't expose the king to check. The solution tracks four pin directions (vertical, horizontal, upLeftDiagonal, upRightDiagonal) without needing to track the specific side of the pin, which significantly simplified the implementation.

Check Detection
For "handleIsChecked", I initially struggled with allowing pieces to block check. The breakthrough came when implementing board state copying to test potential moves without affecting the actual game state - a solution that worked seamlessly.

Future Implementation
Remaining features to implement:
- Pawn promotion
- En passant
- Turn system

I expect en passant to be the most challenging of these. The turn system is being implemented last to facilitate testing, and pawn promotion mainly requires adding UI elements for piece selection.

deployed at: 
paxchess.netlify.app