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

Pawn Promotion
Adding this was pretty seamless and implimented really well with the logic I already had in movePiece. 

En Pessant
This took some thinking, but once I had the idea to set the enPessant value to the x coordinate value of the pawn being promoted, then the balls started rolling. There was some interesting corner cases to take care of, including pawn "i" behind a pawn "j" where "j" has en pessant as a possibility, can pawn "i" can capture a piece on the same column as the pawn "j" can en pessant. Hard to describe hopefully that makes sense. There was also a lot of complications to movePiece to make sure that when en Pessant is played that the pawn it is capturing get's taken off the board.

Turn system
I delayed adding turns for as long as I could because testing how the pieces were moving was a lot easier when I could just move them around without worrying about who's turn it actually was, adding turns was easy and allowed for the functions regarding piece movement to no longer take in "thisPieceColor" and coordinate values because those could be infered and set globally based on who's turn it is.

End Game, checkmate and stalemate
When I started this I logically new that checkmate would just be a stalemate + isInCheck, however figuring out a stalemate check, or rather "isNoLegalMoves" was definitely the most challenging part of this project. The first issue I had, that took way to long to figure out, is that each of my handelePossibleLegal*Moves and handle*Obstacles functions were directly altering the useState of boardData, which made isNoLegalMoves go crazy when I was trying to repeteadly change and test boardData inbetween each move and the timings in javascript were getting all sorts of messed up and the things I would console to the log wouldn't make any sense making finding the source of the issue (altering the useState rather than a normal array) very hard to find. Once I got that figured out and changed all the handlePossibeLegal*Moves and handle*Obstacles functions to return an array that can then later change the useState made it so I could actually re-use all the functions inside of isNoLegalMoves without having to deal with useState being slow and giving half calculated answers. For some reason after doing this there is still a bug regarding king moves when it's in check, it can just walk out of check, but there are no pieces that can block the check, that honestly doesn't seem to make sense, but I worked around it with the kingLegalMoves > 0 check alongside the .some at the end of isNolegalMoves.

Future Implimentations
I am very happy with where it is currently at, might add these in the future:
- Move tracking, so games can be recorded (this works best with future plans)
// these next ones I probably won't add because they don't align with future plans of what I want to do with this chess board
- 50 Move rule, if no pawns are moves and no pieces are captured in 50 moves, it's a draw
- insuffecient material, if there aren't enough pieces for either side to checkmate, it's a draw.



deployed at: 
paxchess.netlify.app